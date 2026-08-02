import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from './Toast';

export default function Contact() {
  const { addToast } = useToast();

  const handleSendMessage = (e) => {
    e.preventDefault();
    addToast('Message sent! Our support team will get back to you shortly.');
    e.target.reset();
  };

  return (
    <div className="view">
      <div className="header-row">
        <h2>Contact Support</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
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
      
      <div className="card" style={{ marginTop: '24px', padding: '2.5rem' }}>
        <h3 style={{ color: '#e8eaed', marginBottom: '2rem', fontSize: '1.4rem' }}>Send us a Message</h3>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }} onSubmit={handleSendMessage}>
          <input required type="text" placeholder="Your Name" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#6c5ce7'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          <input required type="email" placeholder="Your Email Address" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#6c5ce7'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          <textarea required placeholder="How can we help you?" rows="5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#6c5ce7'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}></textarea>
          <button className="approve-btn" style={{ width: 'fit-content', padding: '14px 32px', fontSize: '1rem', fontWeight: '600', marginTop: '8px' }}>Send Message</button>
        </form>
      </div>
    </div>
  );
}
