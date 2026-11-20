import { Link } from 'react-router-dom'
import { ContentPage } from '../components/ContentPage'
import { usePageMeta } from '../hooks/usePageMeta'
import { breadcrumbList } from '../lib/structuredData'

interface InfoPageProps {
  kind: 'about' | 'privacy' | 'terms' | 'contact' | 'disclaimer'
}

const pageDetails = {
  about: ['About ExoCalcHub', 'Simple, trustworthy tools for everyday decisions.', 'Learn how ExoCalcHub helps you calculate with confidence.'],
  privacy: ['Privacy Policy', 'How ExoCalcHub handles information and protects your privacy.', 'Our privacy practices are designed to be clear and minimal.'],
  terms: ['Terms of Service', 'The terms that govern your use of ExoCalcHub.', 'Please review these terms before relying on our tools.'],
  contact: ['Contact ExoCalcHub', 'Have feedback or found an issue? We would love to hear from you.', 'Send us a message and include the calculator or page involved.'],
  disclaimer: ['Calculator Disclaimer', 'Important information about using ExoCalcHub results.', 'Our calculators are educational tools, not professional advice.'],
} as const

export function InfoPage({ kind }: InfoPageProps) {
  const [title, description, intro] = pageDetails[kind]
  usePageMeta({
    title: `${title} | ExoCalcHub`,
    description,
    path: `/${kind}`,
    structuredData: [
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: title, path: `/${kind}` },
      ]),
    ],
  })

  return (
    <ContentPage title={title} description={intro}>
      {kind === 'about' && <>
        <p>ExoCalcHub is a free online calculator platform with 29 calculators for everyday decisions. You can work out health numbers such as body mass index and daily calories, money questions such as loan payments and savings growth, everyday maths such as percentages and averages, and unit conversions such as metres to feet or Celsius to Fahrenheit — all without creating an account.</p>
        <h2>What it helps with</h2>
        <p>The tools are built for the small calculations that come up in real life: checking whether a loan fits your budget, planning what to save each month, converting a recipe or a speed limit while travelling, or understanding a health number before a check-up. Each calculator asks only for the numbers it needs and shows the result with the steps behind it, so you can see how the answer was reached.</p>
        <h2>How to use the calculators</h2>
        <p>Pick a calculator, enter your numbers, and read the result. Every calculator page also explains the method in plain language, works through a realistic example, and answers the questions people most often ask about that calculation — so the page is useful even if you have never used that kind of calculator before.</p>
        <h2>Clear results, honestly presented</h2>
        <p>Results are estimates based on the numbers you enter. Formulas and assumptions are shown on the page, and where a result depends on an assumption — such as an interest rate staying the same, or a mortgage covering principal and interest only — the page says so. Check the assumptions before relying on a result for an important decision, and consult a qualified professional where the decision matters.</p>
        <h2>Accessible by design</h2>
        <p>The calculators work on phones, tablets and computers, with large readable inputs and clear labels. There is no account to create and no fee to use them. Your inputs are processed in your browser and are not sent to us by the calculator itself.</p>
        <h2>Explore the tools</h2>
        <p><Link to="/#calculators">Browse all calculators</Link> or start with our <Link to="/calculators/bmi">BMI calculator</Link>.</p>
      </>}
      {kind === 'privacy' && <>
        <h2>Information we collect</h2>
        <p>Calculator inputs are processed in your browser and are not sent to ExoCalcHub by the calculator itself. We do not require an account to use the platform.</p>
        <h2>Cookies and analytics</h2>
        <p>When analytics is enabled, we use Google Analytics 4. It records which pages are visited and which calculators are used, using cookies. Searches are recorded only as an event that a search happened — the search text itself is never sent. Calculator input values, results and search text are processed in your browser and are never sent to analytics. Analytics is only active when a Measurement ID is configured; without one, no analytics script loads.</p>
        <h2>Advertising</h2>
        <p>We do not currently display advertisements on ExoCalcHub, and no advertising cookies are set. This section describes how advertising would work if we enable Google AdSense in the future.</p>
        <p>If advertising is enabled, third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and other sites on the internet.</p>
        <p>Advertising may be personalized or non-personalized. Personalized advertising uses information such as your prior visits to show ads that may be more relevant to you. Non-personalized advertising uses contextual information, such as the content of the page you are viewing, rather than personal data. You can choose non-personalized advertising in your advertising settings.</p>
        <p>You may opt out of personalized advertising at any time by visiting <a href="https://adssettings.google.com">Google Ads Settings</a>. You may also opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices">www.aboutads.info/choices</a>.</p>
        <p>For more information about how Google uses information from sites that use its services, see <a href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites or apps that use our services</a> and the <a href="https://policies.google.com/technologies/ads">Google advertising privacy information</a>.</p>
        <h2>Stored on your device</h2>
        <p>Your favourite calculators and recent calculations are stored only in your browser's local storage, on your device. Recent calculations are kept for 30 days and then removed automatically, and at most 12 are kept. You can delete them at any time with the "Clear history" button on the home page. This information is never sent to ExoCalcHub or to analytics.</p>
        <h2>Questions</h2>
        <p>For privacy questions, visit our <Link to="/contact">contact page</Link>.</p>
      </>}
      {kind === 'terms' && <>
        <h2>Acceptable use</h2>
        <p>Use ExoCalcHub lawfully and do not attempt to disrupt, abuse, or reverse engineer the service.</p>
        <h2>Results</h2>
        <p>Results are estimates based on the inputs you provide. You are responsible for checking assumptions and deciding whether a result is appropriate for your situation.</p>
        <h2>Changes</h2>
        <p>We may update tools and these terms as the platform evolves. Continued use after an update means you accept the revised terms.</p>
      </>}
      {kind === 'contact' && <>
        <h2>Send feedback</h2>
        <p>Email <a href="mailto:hello@exocalchub.com">hello@exocalchub.com</a> with the page URL, what happened, and the device or browser you used.</p>
        <h2>Useful reports</h2>
        <p>For calculation issues, include the inputs and the result you expected. Please do not include sensitive personal information.</p>
      </>}
      {kind === 'disclaimer' && <>
        <h2>Educational use only</h2>
        <p>ExoCalcHub results are general estimates and are not medical, financial, legal, tax, or other professional advice.</p>
        <h2>Verify important decisions</h2>
        <p>For decisions with meaningful consequences, consult a qualified professional and use authoritative information for your location and circumstances.</p>
      </>}
    </ContentPage>
  )
}
