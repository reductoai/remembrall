import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default async function PrivacyPolicy() {
  return (
    <div className="h-screen overflow-y-auto p-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-2xl">
          <h1 id="terms-of-service-for-remembrall">
            Terms of Service for Remembrall
          </h1>
        </CardHeader>
        <CardContent className="prose text-foreground">
          <p>
            These Terms of Service (&quot;Terms&quot;) apply to the Remembrall
            service operated by Remembrall, Inc. (&quot;Remembrall,&quot;
            &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By using
            Remembrall, you agree to these Terms.
          </p>
          <ol>
            <li>
              <p>
                Binding Agreement. These Terms constitute a binding agreement
                between you and Remembrall. We may update Remembrall and these
                Terms at any time. By continuing to use Remembrall after an
                update, you agree to the updated Terms. If you do not agree, you
                must stop using Remembrall.
              </p>
            </li>
            <li>
              <p>
                Eligibility. You must be at least 18 years old to use
                Remembrall. By using Remembrall, you represent you are 18 or
                older.{" "}
              </p>
            </li>
            <li>
              <p>
                Your Use of Remembrall. You agree to comply with these Terms and
                all applicable laws when using Remembrall. You may only use
                Remembrall for lawful purposes and may not use Remembrall in any
                way that violates others&#39; rights.
              </p>
            </li>
            <li>
              <p>
                Privacy Policy. Please review our Privacy Policy, which
                describes how we collect, use, and share information about you.
                By using Remembrall, you consent to our data practices as
                outlined in our Privacy Policy.
              </p>
            </li>
            <li>
              <p>
                Intellectual Property. Remembrall and its materials are
                protected by copyright, trademark, and other intellectual
                property laws. You may not modify, copy, distribute, transmit,
                display, reproduce, publish, license, frame, create derivative
                works from, transfer, or sell any information or content
                obtained from Remembrall.
              </p>
            </li>
            <li>
              <p>
                Termination. We may terminate your access to Remembrall at any
                time for any reason. You may stop using Remembrall at any time.
                Upon termination, these Terms shall still apply.
              </p>
            </li>
            <li>
              <p>
                Disclaimers. Remembrall is provided &quot;as is&quot; without
                warranties of any kind. We disclaim all warranties, express or
                implied, including warranties of merchantability, fitness for a
                particular purpose, and non-infringement.{" "}
              </p>
            </li>
            <li>
              <p>
                Limitation of Liability. Remembrall shall not be liable for any
                indirect, incidental, special, consequential, or exemplary
                damages arising from your use of Remembrall. Our liability for
                damages shall not exceed $10.
              </p>
            </li>
            <li>
              <p>
                Indemnity. You agree to indemnify and hold Remembrall harmless
                from any claims, damages, losses, liabilities, costs, and
                expenses (including reasonable attorneys&#39; fees) arising from
                your use of Remembrall or violation of these Terms.{" "}
              </p>
            </li>
            <li>
              <p>
                Governing Law. These Terms are governed by the laws of the State
                of California without regard to conflict of law principles.{" "}
              </p>
            </li>
            <li>
              <p>
                Arbitration. Any disputes relating to these Terms or Remembrall
                shall be resolved through binding arbitration in San Francisco,
                California. Arbitration shall be conducted under the rules of
                JAMS. The arbitrator&#39;s decision shall be final and
                enforceable in any court.
              </p>
            </li>
            <li>
              <p>
                No Class Actions. You may only resolve disputes with Remembrall
                on an individual basis and may not bring class arbitrations or
                actions.{" "}
              </p>
            </li>
            <li>
              <p>
                Contact Us. If you have any questions about these Terms, please
                contact us at raunakdoesdev@gmail.com.
              </p>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
