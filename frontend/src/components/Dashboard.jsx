import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Overview from './Overview';
import Pipeline from './Pipeline';
import Analytics from './Analytics';
import Deals from './Deals';
import Queries from './Queries';
import Retailers from './Retailers';
import About from './About';
import Contact from './Contact';

export default function Dashboard({ onPublicSite }) {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const isAdmin = user?.role === 'ADMIN';

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <Overview user={user} />;
      case 'about': return <About />;
      case 'contact': return <Contact />;
      case 'pipeline': return <Pipeline user={user} />;
      case 'analytics': return <Analytics user={user} />;
      case 'deals': return <Deals user={user} />;
      case 'queries': return <Queries />;
      case 'retailers': return <Retailers />;
      default: return <Overview user={user} />;
    }
  };

  return (
    <div className="screen">
      <nav className="dashboard-nav">
        <div className="logo">Wholesale CRM</div>
        <div className="nav-right">
          <span id="user-display">{user.username} ({user.role})</span>
          <button id="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>
      <main>
        <Sidebar activeView={activeView} onViewChange={setActiveView} isAdmin={isAdmin} onPublicSite={onPublicSite} />
        <section id="content">
          {renderView()}
        </section>
      </main>
    </div>
  );
}
