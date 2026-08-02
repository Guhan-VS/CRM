import { useEffect, useState } from 'react';
import { fetchData, patchData, handleQueryAction } from '../api';
import { useToast } from './Toast';

export default function Pipeline({ user }) {
  const [orders, setOrders] = useState([]);
  const [queries, setQueries] = useState([]);
  const { addToast } = useToast();

  const load = () => {
    fetchData('orders').then(setOrders);
    fetchData('queries').then(setQueries);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await patchData('orders', orderId, { status: newStatus });
      addToast(`Status updated to ${newStatus}`);
      load();
    } catch { addToast('Update failed', 'error'); }
  };

  const handleAction = async (queryId, action) => {
    try {
      await handleQueryAction(queryId, action);
      addToast(action === 'approve' ? 'Order approved!' : 'Request rejected');
      load();
    } catch { addToast('Action failed', 'error'); }
  };

  const openRequests = queries.filter(q => q.status === 'Open');

  return (
    <div className="view">
      <div className="header-row"><h2>Sales Pipeline</h2></div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Retailer</th><th>Item</th><th>Qty</th><th>Total (₹)</th>
              <th>Status</th><th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user.role === 'ADMIN' && openRequests.map(q => (
              <tr key={`q-${q.id}`}>
                <td>{q.retailer_name}</td><td>{q.item_name}</td>
                <td>{q.quantity}</td><td>-</td>
                <td><span className="status-badge open">REQUEST</span></td>
                <td>{new Date(q.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="approve-btn" onClick={() => handleAction(q.id, 'approve')}>Approve</button>
                    <button className="btn-secondary" style={{ padding: '7px 18px', fontSize: '0.8rem', borderWidth: '1px' }} onClick={() => handleAction(q.id, 'reject')}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.map(o => (
              <tr key={`o-${o.id}`}>
                <td>{o.retailer_name}</td><td>{o.item_name}</td>
                <td>{o.quantity}</td>
                <td>₹{(o.total_amount || 0).toLocaleString('en-IN')}</td>
                <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                  {user.role === 'ADMIN' ? (
                    <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                      <button className="btn-secondary" style={{ padding: '7px 18px', fontSize: '0.8rem', borderWidth: '1px' }} onClick={() => handleStatusChange(o.id, 'Cancelled')}>Cancel Order</button>
                    )
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && openRequests.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No pipeline data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
