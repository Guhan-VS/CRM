import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchData } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const generateColor = (index) => {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 75%, 65%)`;
};

export default function Analytics({ user }) {
  const [rawData, setRawData] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState('All');
  const [timeframe, setTimeframe] = useState('year');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchData(`analytics?timeframe=${timeframe}&year=${year}&month=${month}`).then(setRawData);
  }, [timeframe, year, month]);

  if (!rawData) {
    return (
      <div className="view">
        <h2>Sales Analytics</h2>
        <p style={{ color: 'var(--text-dim)' }}>Loading chart data...</p>
      </div>
    );
  }

  const outlets = Object.keys(rawData.outlets);
  const isSingleSelected = selectedOutlet !== 'All';

  const datasets = outlets
    .filter(outlet => !isSingleSelected || outlet === selectedOutlet)
    .map((outlet, index) => {
      const color = isSingleSelected ? '#6c5ce7' : generateColor(index);
      return {
        label: outlet,
        data: rawData.outlets[outlet],
        borderColor: color,
        backgroundColor: color.replace('hsl', 'hsla').replace(')', ', 0.12)'),
        borderWidth: 2,
        tension: 0.4,
        fill: isSingleSelected, // Only fill the area if a single outlet is selected to avoid clutter
        pointBackgroundColor: color,
        pointBorderColor: '#1a1d2b',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
      };
    });

  const chartData = {
    labels: rawData.labels || [],
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#8b8fa3', font: { family: 'Inter' } } },
      tooltip: {
        backgroundColor: '#22253a', titleColor: '#e8eaed', bodyColor: '#8b8fa3',
        borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, cornerRadius: 10, padding: 12,
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#5a5e72', callback: v => '₹' + v.toLocaleString('en-IN') } },
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#5a5e72' } }
    }
  };

  return (
    <div className="view">
      <div className="header-row">
        <h2>Sales Analytics</h2>
        <div className="filter-row">
          <select value={timeframe} onChange={e => setTimeframe(e.target.value)}>
            <option value="year">Yearly (by Month)</option>
            <option value="month">Monthly (by Day)</option>
          </select>

          <select value={year} onChange={e => setYear(Number(e.target.value))}>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>

          {timeframe === 'month' && (
            <select value={month} onChange={e => setMonth(Number(e.target.value))}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          )}

          {user?.role === 'ADMIN' && (
            <select value={selectedOutlet} onChange={e => setSelectedOutlet(e.target.value)}>
              <option value="All">All Outlets (Combined)</option>
              {outlets.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
        </div>
      </div>
      <div className="chart-container" style={{ height: '55vh' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
