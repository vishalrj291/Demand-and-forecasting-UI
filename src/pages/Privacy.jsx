export default function Privacy() {
  return (
    <div className="page-shell" style={{ paddingTop: 68 }}>
      <div className="policy-hero">
        <div className="policy-last-update">📅 Last Updated: April 2025</div>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16 }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
          Your privacy matters to us. This policy explains what information ForecastIQ collects,
          how we use it, and your rights regarding that information.
        </p>
      </div>

      <div className="policy-body">
        <div className="policy-divider" />

        <div className="policy-section">
          <h2>1. Information We Collect</h2>
          <p>ForecastIQ is a stateless, academic web application. We do <strong>not</strong> collect, store, or process any personally identifiable information (PII). Specifically:</p>
          <ul>
            <li>We do not require account registration or login</li>
            <li>We do not store form inputs submitted through the dashboard</li>
            <li>We do not use cookies for tracking or advertising</li>
            <li>We do not collect email addresses or contact details</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>2. API Requests</h2>
          <p>When you submit inputs via the Dashboard, the form data (month, unit price, sub-category, inventory parameters) is sent to our backend API hosted on Render for the purpose of computing predictions. This data is:</p>
          <ul>
            <li>Processed in memory only and not persisted to any database</li>
            <li>Used exclusively to return ML predictions back to your browser</li>
            <li>Not shared with third parties</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>3. Log Data</h2>
          <p>Our hosting provider (Render) may automatically collect standard server log data including your IP address, browser type, and request timestamps. This information is retained by Render according to their own privacy policy and is used solely for infrastructure monitoring.</p>
        </div>

        <div className="policy-section">
          <h2>4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Google Fonts</strong> — for typography. Google may collect usage data per their privacy policy.</li>
            <li><strong>Render</strong> — for backend API hosting. Subject to Render's privacy policy.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>5. Cookies</h2>
          <p>ForecastIQ does not use cookies, local storage, or session storage to track users. Any browser caching is handled by the browser itself per standard web behavior.</p>
        </div>

        <div className="policy-section">
          <h2>6. Children's Privacy</h2>
          <p>This Platform is not directed at children under the age of 13. We do not knowingly collect any personal information from children. If you believe a child has submitted personal information through this Platform, please contact us immediately.</p>
        </div>

        <div className="policy-section">
          <h2>7. Data Security</h2>
          <p>Since we do not store personal data, the risk of a data breach involving your personal information is minimal. All API communication occurs over HTTPS to ensure data in transit is encrypted.</p>
        </div>

        <div className="policy-section">
          <h2>8. Your Rights</h2>
          <p>Since we do not store personal information, there is no personal data to access, correct, or delete. If you have concerns about data handled by our third-party providers, please refer to their respective privacy policies.</p>
        </div>

        <div className="policy-section">
          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy occasionally. Any changes will be reflected on this page with an updated revision date. Continued use of the Platform after changes constitutes acceptance of the updated policy.</p>
        </div>

        <div className="policy-section">
          <h2>10. Contact</h2>
          <p>If you have questions or concerns about this Privacy Policy, please contact the ForecastIQ team through the project's repository or your institution's contact channels.</p>
        </div>
      </div>
    </div>
  );
}
