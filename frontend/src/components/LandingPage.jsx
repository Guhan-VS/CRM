import { useEffect, useRef } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from './Toast';

export default function LandingPage({ onLogin }) {
  const canvasRef = useRef(null);
  const { addToast } = useToast();

  const handleSendMessage = (e) => {
    e.preventDefault();
    addToast('Message sent! Our support team will get back to you shortly.');
    e.target.reset();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5, dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4, alpha: Math.random() * 0.4 + 0.1
    }));

    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,92,231,${p.alpha})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(108,92,231,${0.08 * (1 - dist / 120)})`; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="screen">
      <header className="landing-header">
        <div className="logo">Guhan Enterprises</div>
        <nav className="landing-nav">
          <a href="#hero">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <button onClick={onLogin} className="btn-login-nav">Login</button>
        </nav>
      </header>

      <section id="hero" className="hero-section">
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />
        <div className="hero-content">
          <h1>Premium Wholesale Solutions</h1>
          <p>Empowering retailers with high-quality products and seamless supply chain management across India.</p>
          <div className="hero-actions">
            <button onClick={onLogin} className="btn-primary">Access Dashboard</button>
            <a href="#about" className="btn-secondary">Learn More</a>
          </div>
        </div>
      </section>

      <section id="about" className="landing-section">
        <div className="container">
          <h2>About Us</h2>
          <div className="about-grid">
            <div className="card">
              <h3>🎯 Our Mission</h3>
              <p>To streamline the supply chain for electronics and IT infrastructure, ensuring our retail partners always have access to the latest technologies without the overhead of traditional distribution networks.</p>
            </div>
            <div className="card">
              <h3>🏢 Who We Are</h3>
              <p>Guhan Enterprises has been a cornerstone of IT wholesale distribution in South India for over a decade, empowering local retailers with high-quality, enterprise-grade hardware at unmatched competitive prices.</p>
            </div>
            <div className="card">
              <h3>⚡ Why Choose Us?</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}>✦ Direct manufacturer relationships</li>
                <li style={{ marginBottom: '8px' }}>✦ Automated B2B wholesale CRM</li>
                <li style={{ marginBottom: '8px' }}>✦ Transparent, real-time tracking</li>
                <li style={{ marginBottom: '8px' }}>✦ Dedicated account managers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="landing-section bg-alt">
        <div className="container">
          <h2>Contact Us</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <Phone size={48} color="#6c5ce7" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(108,92,231,0.4))' }} />
              <h3 style={{ color: '#e8eaed', marginBottom: '0.75rem', fontSize: '1.3rem' }}>Phone</h3>
              <p style={{ color: '#8b8fa3', marginBottom: '1.5rem' }}>Available Mon-Fri, 9am - 6pm IST</p>
              <p style={{ color: '#6c5ce7', fontSize: '1.4rem', fontWeight: '600' }}>+91 63820 58501</p>
            </div>

            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <Mail size={48} color="#00cec9" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(0,206,201,0.4))' }} />
              <h3 style={{ color: '#e8eaed', marginBottom: '0.75rem', fontSize: '1.3rem' }}>Email</h3>
              <p style={{ color: '#8b8fa3', marginBottom: '1.5rem' }}>For bulk quotes and general inquiries</p>
              <p style={{ color: '#00cec9', fontSize: '1.1rem', fontWeight: '600' }}>support@guhanenterprises.com</p>
            </div>

            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <MapPin size={48} color="#fd79a8" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(253,121,168,0.4))' }} />
              <h3 style={{ color: '#e8eaed', marginBottom: '0.75rem', fontSize: '1.3rem' }}>Headquarters</h3>
              <p style={{ color: '#8b8fa3', marginBottom: '1.5rem' }}>Central Distribution Hub</p>
              <p style={{ color: '#fd79a8', fontSize: '1.1rem', fontWeight: '500', lineHeight: '1.5' }}>
                109A, Tiruvalluvar Nagar<br />
                Ramamurthy Road, Selvapuram<br />
                Coimbatore, Tamil Nadu
              </p>
            </div>
          </div>
          
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ color: '#e8eaed', marginBottom: '2rem', fontSize: '1.4rem' }}>Send us a Message</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }} onSubmit={handleSendMessage}>
              <input required type="text" placeholder="Your Name" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#6c5ce7'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              <input required type="email" placeholder="Your Email Address" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#6c5ce7'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              <textarea required placeholder="How can we help you?" rows="5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#6c5ce7'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}></textarea>
              <button className="approve-btn" style={{ width: 'fit-content', padding: '14px 32px', fontSize: '1rem', fontWeight: '600', marginTop: '8px' }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 Guhan Enterprises. All rights reserved.</p>
      </footer>
    </div>
  );
}
