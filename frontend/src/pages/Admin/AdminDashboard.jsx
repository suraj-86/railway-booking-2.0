import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import StationsPanel from './panels/StationsPanel.jsx';
import TrainsPanel from './panels/TrainsPanel.jsx';

const TABS = [
  { id: 'trains', label: 'Trains', icon: '🚆' },
  { id: 'stations', label: 'Stations', icon: '🚉' }
];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('trains');

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-brand text-slate-100 uppercase tracking-wide">
          ADMIN <span className="text-orange-500">CONTROL</span>
        </h1>
        <p className="text-slate-400 font-tech mt-2">Signed in as {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 font-tech">
        {/* Left tab menu */}
        <div className="flex md:flex-col gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold tracking-wide transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-slate-100'
                  : 'bg-heritage-900/40 text-slate-400 hover:text-slate-200 hover:bg-heritage-900'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right panel */}
        <div>
          {activeTab === 'trains' && <TrainsPanel />}
          {activeTab === 'stations' && <StationsPanel />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
