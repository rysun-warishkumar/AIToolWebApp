import LegalPageLayout from '../components/layout/LegalPageLayout'
import Seo from '../components/seo/Seo'
import { PAGE_SEO } from '../config/seo'

export default function TermsPage() {
  return (
    <>
    <Seo title={PAGE_SEO.terms.title} description={PAGE_SEO.terms.description} path="/terms" />
    <LegalPageLayout title="Terms of Service" subtitle="Rules for using AI Tools Library">
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Acceptance</h2>
        <p>By accessing this website, you agree to these Terms of Service and our Privacy Policy.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. Use of the service</h2>
        <p>
          Content is provided for informational purposes. You may browse tools, prompts, and learning materials for personal or
          internal business use. You may not scrape the site at scale, attempt unauthorized access, or misuse admin credentials.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Content accuracy</h2>
        <p>
          We strive for accurate listings but do not guarantee completeness. Third-party tools are subject to their own terms;
          verify pricing and features on official sites.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. Intellectual property</h2>
        <p>Site design, branding, and original guides are owned by AI Tools Library. User-submitted content remains the responsibility of the submitter.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. Limitation of liability</h2>
        <p>The service is provided &quot;as is&quot; without warranties. We are not liable for damages arising from use of listed tools or reliance on prompts.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Termination</h2>
        <p>We may suspend access for violations of these terms without notice.</p>
      </section>
    </LegalPageLayout>
    </>
  )
}
