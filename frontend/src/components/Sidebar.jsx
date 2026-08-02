import { LayoutDashboard, Info, Phone, GitPullRequest, BarChart3, Tag, ShoppingCart, Users, ExternalLink } from 'lucide-react';

const navItems = [
  { view: 'overview', label: 'Overview', icon: LayoutDashboard },
  { view: 'about', label: 'About Us', icon: Info },
  { view: 'contact', label: 'Contact Us', icon: Phone },
  { view: 'pipeline', label: 'Sales Pipeline', icon: GitPullRequest },
  { view: 'analytics', label: 'Analytics', icon: BarChart3 },
  { view: 'deals', label: 'Deals', icon: Tag },
  { view: 'queries', label: 'Orders/Requests', icon: ShoppingCart, retailerOnly: true },
  { view: 'retailers', label: 'Retailers', icon: Users, adminOnly: true },
];

export default function Sidebar({ activeView, onViewChange, isAdmin, onPublicSite }) {
  return (
    <aside id="sidebar">
      <ul id="nav-menu">
        {navItems.map(item => {
          if (item.adminOnly && !isAdmin) return null;
          if (item.retailerOnly && isAdmin) return null;
          const Icon = item.icon;
          return (
            <li key={item.view}
              className={activeView === item.view ? 'active' : ''}
              onClick={() => onViewChange(item.view)}>
              <Icon size={18} />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
      <div className="sidebar-footer">
        <button onClick={onPublicSite} className="btn-sidebar-link">
          <ExternalLink size={16} /> Public Site
        </button>
      </div>
    </aside>
  );
}
