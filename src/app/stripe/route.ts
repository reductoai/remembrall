import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import type Stripe from "stripe";
import { buffer } from "micro";
import { match } from "ts-pattern";
// import {
//   handleInvoicePaid,
//   handleSubscriptionCanceled,
//   handleSubscriptionCreatedOrUpdated,
// } from "../../server/stripe/stripe-webhook-handlers";
import { stripe } from "../../server/stripe/client";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);

    match(event.type)
      .with("invoice.paid", async () => {})
      .with("customer.subscription.created", async () => {})
      .with("customer.subscription.updated", async () => {})
      .with("invoice.payment_failed", async () => {})
      .with("customer.subscription.deleted", async () => {})
      .otherwise(() => {});

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(err);
    return;
  }
}
