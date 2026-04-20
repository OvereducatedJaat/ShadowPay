import { useState } from 'react';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployeeVault from './pages/EmployeeVault';
import AuditorView from './pages/AuditorView';

function App() {
  const [activeTab, setActiveTab] = useState<'employer' | 'employee' | 'auditor'>('employer');

  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          ShadowPay
        </div>
        <nav className="nav-links">
          <span 
            className={`nav-link ${activeTab === 'employer' ? 'active' : ''}`}
            onClick={() => setActiveTab('employer')}
          >
            Employer Dashboard
          </span>
          <span 
            className={`nav-link ${activeTab === 'employee' ? 'active' : ''}`}
            onClick={() => setActiveTab('employee')}
          >
            Employee Vault
          </span>
          <span 
            className={`nav-link ${activeTab === 'auditor' ? 'active' : ''}`}
            onClick={() => setActiveTab('auditor')}
          >
            Compliance (Privara)
          </span>
        </nav>
      </header>

      <main>
        {activeTab === 'employer' && <EmployerDashboard />}
        {activeTab === 'employee' && <EmployeeVault />}
        {activeTab === 'auditor' && <AuditorView />}
      </main>
    </div>
  );
}

export default App;
