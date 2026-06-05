import { Link } from 'react-router-dom'
import LegalPageLayout from '../components/layout/LegalPageLayout'
import Seo from '../components/seo/Seo'

export default function PrivacyPolicyPage() {
  return (
    <>
    <Seo title="Privacy Policy" description="Privacy Policy for AI Tools Library." path="/privacy" />
    <LegalPageLayout title="Privacy Policy" subtitle="How we collect, use, and protect your information">
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Information we collect</h2>
        <p>
          When you use AI Tools Library, we may collect information you provide directly (such as contact form submissions),
          usage data (pages visited, filters used), and technical data (browser type, device, approximate location from IP).
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. How we use information</h2>
        <p>We use collected data to operate and improve the service, respond to inquiries, analyze trends, and maintain security. We do not sell your personal information.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Cookies</h2>
        <p>
          We use essential cookies for authentication (admin area) and preferences (such as theme). See our{' '}
          <Link to="/cookie-policy" className="text-primary-600 hover:underline">Cookie Policy</Link> for details.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. Third-party links</h2>
        <p>Tool and resource listings may link to external websites. We are not responsible for their privacy practices.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. Your rights</h2>
        <p>You may request access, correction, or deletion of personal data we hold by contacting us via the Contact page.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Changes</h2>
        <p>We may update this policy from time to time. Continued use of the site after changes constitutes acceptance.</p>
      </section>
    </LegalPageLayout>
    </>
  )
}
