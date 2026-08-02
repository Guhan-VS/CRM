export default function About() {
  return (
    <div className="view">
      <div className="header-row">
        <h2>About Guhan Enterprises</h2>
      </div>
      <div className="card" style={{ padding: '2.5rem', lineHeight: '1.8', maxWidth: '900px' }}>
        <h3 style={{ color: '#e8eaed', marginBottom: '1rem', fontSize: '1.5rem' }}>Our Legacy</h3>
        <p style={{ color: '#8b8fa3', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
          Guhan Enterprises has been a cornerstone of IT wholesale distribution in South India for over a decade. We specialize in empowering local retailers with high-quality, enterprise-grade hardware and software solutions at unmatched competitive prices.
        </p>

        <h3 style={{ color: '#e8eaed', marginBottom: '1rem', fontSize: '1.5rem' }}>Our Mission</h3>
        <p style={{ color: '#8b8fa3', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
          To streamline the supply chain for electronics and IT infrastructure, ensuring our retail partners always have access to the latest technologies without the overhead of traditional distribution networks. We believe in building long-term partnerships through transparent, automated, and lightning-fast digital pipelines.
        </p>

        <h3 style={{ color: '#e8eaed', marginBottom: '1rem', fontSize: '1.5rem' }}>Why Partner With Us?</h3>
        <ul style={{ color: '#8b8fa3', listStyleType: 'none', paddingLeft: '0', fontSize: '1.05rem' }}>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#6c5ce7' }}>•</span> Direct manufacturer relationships guaranteeing authentic products.
          </li>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#00cec9' }}>•</span> Automated, transparent wholesale CRM tailored for rapid B2B transactions.
          </li>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#fd79a8' }}>•</span> Dedicated account managers for every retail partner ensuring zero downtime.
          </li>
        </ul>
      </div>
    </div>
  );
}
