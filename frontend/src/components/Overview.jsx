import { useEffect, useState, useRef } from 'react';
import { fetchData } from '../api';

function AnimatedNumber({ value, prefix = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const duration = 800;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      ref.current.textContent = prefix + Math.floor(value * eased).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [value, prefix]);
  return <p ref={ref}>{prefix}0</p>;
}

export default function Overview({ user }) {
  const [stats, setStats] = useState({ total_sales: 0, order_count: 0 });
  const [retailerCount, setRetailerCount] = useState(0);

  useEffect(() => {
    fetchData('analytics').then(setStats);
    if (user.role === 'ADMIN') {
      fetchData('users').then(data => setRetailerCount(data.length || 0));
    }
  }, [user]);

  return (
    <div className="view">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <AnimatedNumber value={stats.total_sales || 0} prefix="₹" />
        </div>
        <div className="stat-card">
          <h3>Orders</h3>
          <AnimatedNumber value={stats.order_count || 0} />
        </div>
        {user.role === 'ADMIN' && (
          <div className="stat-card">
            <h3>Active Retailers</h3>
            <AnimatedNumber value={retailerCount} />
          </div>
        )}
      </div>
      <div className="welcome-banner">
        <h3>Welcome back, {user.username}!</h3>
        <p>Here's what's happening with your account today.</p>
      </div>
    </div>
  );
}
