import { useEffect, useState } from 'react';
import { fetchData, postData } from '../api';
import { useToast } from './Toast';
import Modal from './Modal';

export default function Deals({ user }) {
  const [deals, setDeals] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const { addToast } = useToast();

  const load = () => fetchData('deals').then(setDeals);
  useEffect(() => { load(); }, []);

  const filtered = filter === 'All' ? deals : deals.filter(d => d.category === filter);
  const categories = ['All', 'Laptops', 'Desktop PCs', 'Computer Accessories', 'Networking', 'Storage Devices', 'Service Items'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await postData('deals', Object.fromEntries(fd));
      addToast('Deal created!');
      setShowModal(false);
      load();
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd);
    payload.item_name = selectedDeal.title.replace('Wholesale: ', '');
    
    try {
      await postData('queries', payload);
      addToast('Order Request successfully submitted to pipeline!');
      setSelectedDeal(null);
    } catch (err) { addToast(err.message, 'error'); }
  };

  const getBadgeText = (deal, currentFilter) => {
    if (currentFilter === 'All') return deal.category || 'General';
    
    let text = deal.title;
    const lower = text.toLowerCase();
    
    if (lower.includes('logitech') && (lower.includes('mouse') || lower.includes('master'))) return 'Logitech Mouse';
    if (lower.includes('docking station')) return 'Docking Station';
    if (lower.includes('chair')) return 'Office Chair';
    if (lower.includes('webcam')) return 'Webcam';
    
    text = text.replace(/Wholesale\s+Offer.*?(on)\s+/i, '');
    text = text.replace(/Wholesale\s*:\s*/i, '');
    text = text.replace(/\b(Exclusive|Special|Reliable|Bulk|High-Performance|Ergonomic)\b/gi, '');
    text = text.replace(/\(.*?\)/g, '');
    text = text.replace(/\s{2,}/g, ' ').trim();
    
    if (!text || text.length > 25) return deal.category || 'General';
    return text;
  };

  return (
    <div className="view">
      <div className="header-row">
        <h2>Wholesale Offers</h2>
        <div className="filter-row">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>
          {user.role === 'ADMIN' && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Deal</button>
          )}
        </div>
      </div>
      <div className="grid-container">
        {filtered.map((deal, i) => (
          <div key={deal.id} className="card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="category-badge">{getBadgeText(deal, filter)}</div>
            <h3>{deal.title}</h3>
            <p>{deal.description}</p>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="discount">{deal.discount_percentage}% OFF</span>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>₹{Number(deal.discounted_price).toLocaleString('en-IN')}</span>
              <span style={{ marginLeft: '8px', textDecoration: 'line-through', color: 'var(--text-dim)', fontSize: '0.9rem' }}>₹{Number(deal.original_price).toLocaleString('en-IN')}</span>
            </div>
            <p><small>Expires: {deal.valid_until}</small></p>
            {user.role !== 'ADMIN' && (
              <button className="btn-order" onClick={() => setSelectedDeal(deal)}>Order Now</button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>No deals found</div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Wholesale Deal">
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Deal Title" required />
          <textarea name="description" placeholder="Description" required />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" step="0.01" name="original_price" placeholder="Original Price (₹)" required style={{ flex: 1 }} />
            <input type="number" step="0.01" name="discounted_price" placeholder="Discounted Price (₹)" required style={{ flex: 1 }} />
          </div>
          <input type="number" step="0.1" name="discount_percentage" placeholder="Discount %" required />
          <input type="date" name="valid_until" required />
          <div className="modal-actions">
            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit">Create Deal</button>
          </div>
        </form>
      </Modal>

      {/* Retailer Order Modal */}
      <Modal isOpen={!!selectedDeal} onClose={() => setSelectedDeal(null)} title="Place Order Request">
        {selectedDeal && (
          <form onSubmit={handleOrderSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#8b8fa3' }}>Item:</strong>
              <div style={{ color: '#e8eaed', fontSize: '1.1rem', marginTop: '4px' }}>{selectedDeal.title}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#8b8fa3' }}>Price per unit:</strong>
              <div style={{ color: '#6c5ce7', fontSize: '1.1rem', marginTop: '4px' }}>₹{Number(selectedDeal.discounted_price).toLocaleString('en-IN')}</div>
            </div>
            
            <input type="number" name="quantity" placeholder="Quantity required (e.g. 50)" required style={{ marginBottom: '16px' }} />
            <textarea name="message" placeholder="Additional Notes / Shipping Requirements" rows="4"></textarea>
            
            <div className="modal-actions" style={{ marginTop: '24px' }}>
              <button type="button" onClick={() => setSelectedDeal(null)}>Cancel</button>
              <button type="submit" className="approve-btn">Submit Request</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
