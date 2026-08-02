import { useEffect, useState } from 'react';
import { fetchData, postData, patchData } from '../api';
import { useToast } from './Toast';
import Modal from './Modal';

const GRADIENTS = [
  'linear-gradient(135deg,#6c5ce7,#a29bfe)',
  'linear-gradient(135deg,#00cec9,#81ecec)',
  'linear-gradient(135deg,#fd79a8,#fab1a0)',
  'linear-gradient(135deg,#fdcb6e,#ffeaa7)',
  'linear-gradient(135deg,#6c5ce7,#fd79a8)',
  'linear-gradient(135deg,#00b894,#55efc4)',
];

export default function Retailers() {
  const [retailers, setRetailers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', business_name: '', phone: '', address: '' });
  const { addToast } = useToast();

  const load = () => fetchData('users').then(setRetailers);
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ username: '', email: '', password: '', business_name: '', phone: '', address: '' });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditId(r.id);
    setForm({
      username: r.username || '', email: r.email || '',
      password: r.display_password || '', business_name: r.business_name || '',
      phone: r.phone || '', address: r.address || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await patchData('users', editId, form);
        addToast('Retailer updated!');
      } else {
        await postData('users', form);
        addToast('Retailer created!');
      }
      setShowModal(false);
      load();
    } catch (err) { addToast(err.message, 'error'); }
  };

  return (
    <div className="view">
      <div className="header-row">
        <h2>Retailers</h2>
        <button className="btn-primary" onClick={openAdd}>+ Add Retailer</button>
      </div>

      <div className="retailers-stats-row">
        <div className="mini-stat">
          <span className="mini-stat-value">{retailers.length}</span>
          <span className="mini-stat-label">Total Retailers</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-value">{retailers.length}</span>
          <span className="mini-stat-label">Active Accounts</span>
        </div>
      </div>

      <div className="retailers-grid">
        {retailers.map((r, i) => (
          <div key={r.id} className="retailer-card">
            <div className="retailer-card-header">
              <div className="retailer-avatar" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                {(r.username || '?').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="retailer-name">{r.username}</div>
                <div className="retailer-role">Retailer</div>
              </div>
            </div>
            <div className="retailer-info">
              <InfoRow label="Business" value={r.business_name} />
              <InfoRow label="Phone" value={r.phone} />
              <InfoRow label="Address" value={r.address} />
              <InfoRow label="Password" value={r.display_password || '[Secure]'} />
            </div>
            <div className="retailer-card-actions">
              <button className="btn-edit" onClick={() => openEdit(r)}>✏️ Edit</button>
            </div>
          </div>
        ))}
        {retailers.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No retailers yet</p>
            <p style={{ fontSize: '.85rem' }}>Click <strong>+ Add Retailer</strong> to create one</p>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Retailer' : 'Add New Retailer'}>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required={!editId} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <input type="text" placeholder="Business Name" value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} />
          <input type="text" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <textarea placeholder="Business Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <div className="modal-actions">
            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit">{editId ? 'Update' : 'Save'} Retailer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="retailer-info-row">
      <span className="info-label">{label}</span>
      <span className={`info-value ${value ? '' : 'empty'}`}>{value || 'Not set'}</span>
    </div>
  );
}
