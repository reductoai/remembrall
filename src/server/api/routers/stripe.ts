import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import type Stripe from "stripe";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const getOrCreateStripeCustomerIdForUser = async ({
  stripe,
  prisma,
  userId,
}: {
  stripe: Stripe;
  prisma: PrismaClient;
  userId: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("User not found");

  if (user.stripeId) {
    return user.stripeId;
  }

  // create a new customer
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.name ?? undefined,
    // use metadata to link this Stripe customer to internal user id
    metadata: {
      userId,
    },
  });

  // update with new customer id
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeId: customer.id,
    },
  });

  return updatedUser.stripeId!;
};

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(z.enum(["base", "full"]))
    .mutation(async ({ ctx, input }) => {
      const { stripe, session, prisma } = ctx;

      const customerId = await getOrCreateStripeCustomerIdForUser({
        prisma,
        stripe,
        userId: session.user?.id,
      });

      if (!customerId) {
        throw new Error("Could not create customer");
      }

      const baseUrl = env.NEXTAUTH_URL;

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: session.user?.id,
        payment_method_types: ["card"],
        mode: "subscription",
        allow_promotion_codes: true,
        line_items: [
          {
            price:
              input === "base"
                ? env.STRIPE_PRICE_ID_BASE
                : env.STRIPE_PRICE_ID_FULL,
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/dashboard?checkoutSuccess=true`,
        cancel_url: `${baseUrl}/dashboard?checkoutCanceled=true`,
        subscription_data: {
          metadata: {
            userId: session.user?.id,
          },
        },
      });

      if (!checkoutSession) {
        throw new Error("Could not create checkout session");
      }

      return { checkoutUrl: checkoutSession.url };
    }),
  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, session, prisma } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId: session.user?.id,
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl = env.NEXTAUTH_URL;

    const stripeBillingPortalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/dashboard`,
      });

    if (!stripeBillingPortalSession) {
      throw new Error("Could not create billing portal session");
    }

    return { billingPortalUrl: stripeBillingPortalSession.url };
  }),
});
