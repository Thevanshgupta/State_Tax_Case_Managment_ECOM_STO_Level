import { useState } from 'react';
import Sidebar  from './Sidebar.jsx';
import Header   from './Header.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../hooks/useData.js';

/* Admin pages */
import AdminOverview from '../../pages/admin/AdminOverview.jsx';
import AdminCases    from '../../pages/admin/AdminCases.jsx';
import AdminUsers    from '../../pages/admin/AdminUsers.jsx';
import AdminStages   from '../../pages/admin/AdminStages.jsx';
import AdminAudit    from '../../pages/admin/AdminAudit.jsx';

/* EDCOM pages */
import EdcomOverview from '../../pages/edcom/EdcomOverview.jsx';
import EdcomCreate   from '../../pages/edcom/EdcomCreate.jsx';
import EdcomAssign   from '../../pages/edcom/EdcomAssign.jsx';
import EdcomProgress from '../../pages/edcom/EdcomProgress.jsx';
import FlaggedCases  from '../../pages/edcom/FlaggedCases.jsx';

/* STO pages */
import StoOverview   from '../../pages/sto/StoOverview.jsx';
import StoCases      from '../../pages/sto/StoCases.jsx';

const VIEW_META = {
  overview: { admin: ['Dashboard Overview', 'System-wide statistics'],  edcom: ['EDCOM Dashboard', 'Assignment and tracking'], sto: ['My Dashboard', 'Your circle summary'] },
  cases:    { admin: ['All Cases', 'Full system case registry'],          sto:   ['My Cases', 'Cases assigned to you'] },
  users:    { admin: ['User Management', 'Manage STO and EDCOM officers'] },
  stages:   { admin: ['Action Stage Config', 'Configure ASMT / DRC stages'] },
  audit:    { admin: ['Audit Log', 'System-wide audit trail'] },
  create:   { edcom: ['Create New Case', 'Register a new case'] },
  assign:   { edcom: ['Assign Cases', 'Assign cases to STO officers'] },
  progress: { edcom: ['Case Progress', 'Real-time case tracking'] },
  flagged:  { admin: ['Flagged Cases', 'Cases flagged for attention'], edcom: ['Flagged Cases', 'Flagged cases'], sto: ['Flagged Cases', 'Your flagged cases'] },
};

export default function AppShell() {
  const { user, logout } = useAuth();
  const data = useData(user);
  const [view, setView] = useState('overview');

  const [title, sub] = VIEW_META[view]?.[user.role] || [view, ''];

  const renderView = () => {
    switch (view) {
      case 'overview':
        if (user.role === 'admin') return <AdminOverview stats={data.stats} cases={data.cases} />;
        if (user.role === 'edcom') return <EdcomOverview stats={data.stats} cases={data.cases} />;
        return <StoOverview stats={data.stats} cases={data.cases} user={user} />;

      case 'cases':
        if (user.role === 'admin') return <AdminCases cases={data.cases} stages={data.stages} data={data} currentUser={user} />;
        return <StoCases cases={data.cases} stages={data.stages} data={data} currentUser={user} />;

      case 'users':    return <AdminUsers users={data.users} data={data} />;
      case 'stages':   return <AdminStages stages={data.stages} data={data} />;
      case 'audit':    return <AdminAudit data={data} />;
      case 'create':   return <EdcomCreate data={data} users={data.users} />;
      case 'assign':   return <EdcomAssign cases={data.cases} users={data.users} data={data} />;
      case 'progress': return <EdcomProgress cases={data.cases} />;
      case 'flagged':
        return <FlaggedCases
          cases={user.role === 'sto' ? data.cases.filter(c => c.assignedTo === user.id) : data.cases}
          stages={data.stages} data={data} currentUser={user} />;

      default: return <div style={{ padding: 20, color: '#94a3b8' }}>Select a menu item.</div>;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar role={user.role} active={view} setActive={setView} user={user} onLogout={logout} />
      <div className="main-content">
        <Header title={title} sub={sub} busy={data.busy} />
        <div className="page-body">{renderView()}</div>
      </div>
    </div>
  );
}