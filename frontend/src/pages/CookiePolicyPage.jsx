import LegalPageLayout from '../components/layout/LegalPageLayout'
import Seo from '../components/seo/Seo'
import { PAGE_SEO } from '../config/seo'

export default function CookiePolicyPage() {
  return (
    <>
    <Seo title={PAGE_SEO.cookies.title} description={PAGE_SEO.cookies.description} path="/cookie-policy" />
    <LegalPageLayout title="Cookie Policy" subtitle="How we use cookies and similar technologies">
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">What are cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help the site remember preferences and improve your experience.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cookies we use</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Essential:</strong> Admin session token (localStorage) for authenticated administrators.</li>
          <li><strong>Preferences:</strong> Theme selection (light/dark mode) stored locally.</li>
          <li><strong>Analytics:</strong> We may use privacy-friendly analytics in the future; you will be notified if that changes.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Managing cookies</h2>
        <p>You can clear cookies and local storage via your browser settings. Note that clearing storage will log you out of the admin area and reset theme preferences.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Updates</h2>
        <p>This policy may be revised as our features evolve. Check this page for the latest version.</p>
      </section>
    </LegalPageLayout>
    </>
  )
}
