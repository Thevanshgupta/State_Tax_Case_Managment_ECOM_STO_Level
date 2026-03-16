import { ROLE_LABELS } from '../../constants/index.js';
import { initials } from '../../utils/helpers.js';

const MENUS = {
  admin: [
    { view: 'overview', icon: '📊', label: 'Dashboard Overview', section: 'Main' },
    { view: 'cases',    icon: '📁', label: 'All Cases'          },
    { view: 'users',    icon: '👥', label: 'User Management',   section: 'Administration' },
    { view: 'stages',   icon: '⚙️', label: 'Action Stages'     },
    { view: 'audit',    icon: '📋', label: 'Audit Log'          },
  ],
  edcom: [
    { view: 'overview', icon: '📊', label: 'Dashboard Overview', section: 'Main' },
    { view: 'create',   icon: '➕', label: 'Create Case',        section: 'Case Management' },
    { view: 'assign',   icon: '🔗', label: 'Assign Cases'       },
    { view: 'progress', icon: '📈', label: 'Case Progress'      },
    { view: 'flagged',  icon: '🚩', label: 'Flagged Cases'      },
  ],
  sto: [
    { view: 'overview', icon: '📊', label: 'My Dashboard',   section: 'Main' },
    { view: 'cases',    icon: '📁', label: 'My Cases',        section: 'Cases' },
    { view: 'flagged',  icon: '🚩', label: 'Flagged Cases'   },
  ],
};

export default function Sidebar({ role, active, setActive, user, onLogout }) {
  const items = MENUS[role] || [];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="flex-gap-8">
          <span style={{ fontSize: 22 }}>⚖️</span>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Govt. of India</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>Tax Case Management</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 1 }}>TCMS v1.0.0</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="sidebar-user">
        <div className="flex-gap-8">
          <div className="sidebar-avatar">{initials(user.name)}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)' }}>{ROLE_LABELS[role]}</div>
            {user.circle && <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 1 }}>{user.circle}</div>}
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="sidebar-nav">
        {items.map((m) => (
          <div key={m.view}>
            {m.section && <div className="sidebar-section">{m.section}</div>}
            <div
              className={`sidebar-item${active === m.view ? ' active' : ''}`}
              onClick={() => setActive(m.view)}
            >
              <span className="s-icon">{m.icon}</span>
              {m.label}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-item" onClick={onLogout} style={{ color: 'rgba(255,100,100,.85)' }}>
          <span className="s-icon">🚪</span> Logout
        </div>
      </div>
    </div>
  );
}