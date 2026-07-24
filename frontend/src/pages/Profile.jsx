import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const Profile = () => {
  const { user, token, login } = useContext(AuthContext); // Destructure login to update context
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const [metrics, setMetrics] = useState({ totalJourneys: 0, upcoming: 0, miles: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch initial profile metrics
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Failed to load profile');
        
        setMetrics(data.metrics || { totalJourneys: 0, upcoming: 0, miles: 0 });
      } catch (err) {
        console.error("Profile data error:", err);
        setError("Could not retrieve live metrics from database.");
      } finally {
        setIsLoading(false);
      }
    };
    if (user && token) fetchProfileData();
  }, [user, token]);

  // Handle saving the updated profile details
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: editName })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to update profile');
      
      // Update the global AuthContext so the Navbar updates instantly
      login(data.user, token);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 flex flex-col md:flex-row gap-8 min-h-[75vh] font-tech">
      
      {/* Left Column: Identity & Stats */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-1/3 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="bg-heritage-900 border border-heritage-800 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          
          <div className="flex justify-end mb-2">
            {isEditing ? (
              <div className="space-x-2">
                <button onClick={() => { setIsEditing(false); setEditName(user?.name); }} className="text-slate-400 hover:text-slate-200 text-xs font-bold tracking-widest transition-colors px-2 py-1">CANCEL</button>
                <button onClick={handleSaveProfile} disabled={isSaving} className="text-green-400 hover:text-green-300 text-xs font-bold tracking-widest transition-colors border border-green-400/50 px-3 py-1 rounded-lg">
                  {isSaving ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="text-orange-500 hover:text-orange-400 text-xs font-bold tracking-widest transition-colors border border-orange-500/50 px-3 py-1 rounded-lg">
                EDIT
              </button>
            )}
          </div>

          <div className="w-24 h-24 mx-auto bg-heritage-950 border-2 border-orange-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <span className="text-4xl font-brand text-orange-500">{user?.name ? user.name.charAt(0).toUpperCase() : 'P'}</span>
          </div>
          
          {isEditing ? (
            <input 
              type="text" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
              className="w-full bg-heritage-950 border border-heritage-800 rounded-lg px-3 py-2 text-slate-100 text-center font-brand mb-4 focus:border-orange-500 focus:outline-none" 
              placeholder="Your Name"
            />
          ) : (
            <h2 className="text-2xl font-brand text-slate-100 uppercase tracking-wide mb-1">{user?.name || 'PASSENGER'}</h2>
          )}
          
          <p className="text-slate-400 font-tech text-sm tracking-widest mb-6">{user?.email || 'N/A'}</p>
          
          {success && <p className="text-green-400 text-xs mb-4">{success}</p>}
          {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-xs tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> DB SECURED
          </div>
        </div>

        {/* Metrics Card */}
        <div className="bg-heritage-900 border border-heritage-800 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-lg font-brand text-slate-100 mb-6 tracking-wide border-b border-heritage-800 pb-4">TRAVEL METRICS</h3>
          {isLoading ? (
            <p className="text-slate-500 text-sm animate-pulse">Syncing metrics...</p>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Journeys</span>
                <span className="text-xl font-bold text-orange-500">{metrics.totalJourneys}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Upcoming Trips</span>
                <span className="text-xl font-bold text-slate-100">{metrics.upcoming}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Miles Traveled</span>
                <span className="text-xl font-bold text-slate-100">{metrics.miles} km</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Right Column: Placeholder for future features */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-2/3 flex flex-col gap-6">
        <div className="bg-heritage-900 border border-heritage-800 rounded-3xl p-8 shadow-2xl flex-grow">
          <h3 className="text-xl font-brand text-slate-100 tracking-wide border-b border-heritage-800 pb-4 mb-6">SAVED PASSENGERS</h3>
          <p className="text-slate-500 text-sm italic">No saved passengers found in database. Feature coming soon.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;