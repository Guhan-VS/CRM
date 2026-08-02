import { useEffect, useState } from 'react';
import { fetchData, postData } from '../api';
import { useToast } from './Toast';
import Modal from './Modal';

export default function Queries() {
  const [queries, setQueries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deals, setDeals] = useState([]);
  const { addToast } = useToast();

  const load = () => fetchData('queries').then(setQueries);
  useEffect(() => { load(); fetchData('deals').then(setDeals); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await postData('queries', Object.fromEntries(fd));
      addToast('Request submitted!');
      setShowModal(false);
      load();
    } catch (err) { addToast(err.message, 'error'); }
  };

  return (
    <div className="view">
      <div className="header-row">
        <h2>Product Requests</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>Submit New Request</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Notes</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {queries.map(q => (
              <tr key={q.id}>
                <td>{q.item_name}</td>
                <td>{q.quantity}</td>
                <td>{q.message || '-'}</td>
                <td><span className={`status-badge ${q.status.toLowerCase()}`}>{q.status}</span></td>
                <td>{new Date(q.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {queries.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No requests found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Place Product Request">
        <form onSubmit={handleSubmit}>
          <input type="text" name="item_name" placeholder="Item Name" list="deal-items-list" required />
          <datalist id="deal-items-list">
            {deals.map(d => <option key={d.id} value={d.title.replace('Wholesale Deal: ', '').replace('Bulk Offer: ', '')} />)}
          </datalist>
          <input type="text" name="quantity" placeholder="Quantity (e.g. 50)" required />
          <textarea name="message" placeholder="Additional Notes" />
          <div className="modal-actions">
            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit">Submit Request</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
