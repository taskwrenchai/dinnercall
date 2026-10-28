
export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-800">
      <article className="mx-auto max-w-3xl space-y-6">
        <a href="/app" className="text-green-700 hover:underline">
          ← Back to DinnerCall
        </a>

        <h1 className="text-3xl font-bold text-gray-900">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-500">
          Last updated: October 25, 2026
        </p>

        <p>
         DinnerCall is an independently operated meal-planning and
         recipe-generation service. This Privacy Policy explains
         what information we collect, how we use it, and the choices
         available to you when using DinnerCall. For privacy-related
         questions, you can contact the operator of DinnerCall at
         privacy@getdinnercall.com.
        </p>


        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>
          We may collect your email address, account identifiers, meal
          preferences, ingredients you provide, dietary restrictions,
          saved recipes, meal plans, feedback, and information about
          your use of DinnerCall.
        </p>

        <h2 className="text-xl font-semibold">2. How We Use Information</h2>
        <p>
          We use information to operate DinnerCall, generate recipes,
          create meal plans and grocery lists, maintain accounts,
          respond to feedback, improve our services, and help protect
          the security and reliability of the application.
        </p>

        <h2 className="text-xl font-semibold">3. AI-Generated Content</h2>
        <p>
          DinnerCall uses OpenAI technology to help generate recipes
          and meal-planning suggestions. Information you enter for
          these features may be transmitted to OpenAI for processing.
          Please avoid entering sensitive personal information that
          is not necessary to generate your meals.
        </p>

        <h2 className="text-xl font-semibold">4. Service Providers</h2>
        <p>
          DinnerCall uses third-party services, including Supabase
          for authentication and data storage, Vercel for hosting,
          and OpenAI for AI-powered features. These providers may
          process information as needed to deliver their services.
        </p>

        
<h2 className="text-xl font-semibold">
  Analytics and Service Improvement
</h2>
<p>
  DinnerCall may use analytics tools to understand how visitors
  interact with the service, identify technical problems, and
  improve the user experience. These tools may collect information
  such as pages visited, feature usage, device and browser
  information, and approximate location derived from IP addresses.
  We will update this policy to identify additional analytics
  providers and describe their data practices before enabling
  them.
</p>

        
        <h2 className="text-xl font-semibold">5. Data Retention and Deletion</h2>
        <p>
          We retain account information and associated data as needed
          to provide DinnerCall. You can request deletion of your
          account using the Delete Account feature. Deleting your
          account removes associated account records, saved recipes,
          usage events, and feedback from DinnerCall's active database,
          subject to applicable legal obligations and any backup or
          provider retention requirements.
        </p>

        <h2 className="text-xl font-semibold">6. Security</h2>
        <p>
          We use reasonable technical and organizational measures to
          protect information. However, no internet-based service can
          guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold">7. Your Choices</h2>
        <p>
          You may choose what meal preferences and ingredients to
          provide, manage saved information through available
          features, and delete your account. You may also contact
          us with privacy-related questions.
        </p>

        <h2 className="text-xl font-semibold">8. Children's Privacy</h2>
        <p>
          DinnerCall is not intended for children under 13. We do
          not knowingly collect personal information from children
          under 13. Contact us if you believe a child has provided
          personal information.
        </p>

        <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
        <p>
          We may update this policy as DinnerCall evolves. Updates
          will be posted on this page with a revised date.
        </p>

        <h2 className="text-xl font-semibold">10. Contact Us</h2>
        <p>
          For privacy questions or requests, email{" "}
          <a
            href="mailto:privacy@getdinnercall.com"
            className="text-green-700 hover:underline"
          >
            privacy@getdinnercall.com
          </a>.
        </p>
      </article>
    </main>
  );
}
