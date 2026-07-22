import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  
  // API-Ready State
  const [metrics, setMetrics] = useState({ totalJourneys: 0, upcoming: 0, miles: 0 });
  const [savedPassengers, setSavedPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // FUTURE BACKEND API HANDLER
  useEffect(() => {
    const fetchProfileData = async () => {
      // TODO: Uncomment when backend is ready
      /*
      try {
        const response = await fetch(`http://localhost:5000/api/users/${user?.id}/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('railway_token')}` }
        });
        const data = await response.json();
        setMetrics(data.metrics);
        setSavedPassengers(data.savedPassengers);
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setIsLoading(false);
      }
      */
      setIsLoading(false); // Remove this once API is connected
    };

    if (user) fetchProfileData();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 flex flex-col md:flex-row gap-8 min-h-[75vh]">
      
      {/* Left Column: Identity & Stats */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-heritage-900 border border-heritage-800 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="text-orange-500 hover:text-orange-400 text-xs font-bold tracking-widest transition-colors border border-orange-500/50 px-3 py-1 rounded-lg"
            >
              {isEditing ? 'SAVE' : 'EDIT'}
            </button>
          </div>

          <div className="w-24 h-24 mx-auto bg-heritage-950 border-2 border-orange-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <span className="text-4xl font-brand text-orange-500">{user?.name ? user.name.charAt(0).toUpperCase() : 'P'}</span>
          </div>
          
          {isEditing ? (
            <input type="text" defaultValue={user?.name} className="w-full bg-heritage-950 border border-heritage-800 rounded-lg px-3 py-2 text-slate-100 text-center font-brand mb-4 focus:border-orange-500 focus:outline-none" />
          ) : (
            <h2 className="text-2xl font-brand text-slate-100 uppercase tracking-wide mb-1">{user?.name || 'PASSENGER'}</h2>
          )}
          
          <p className="text-slate-400 font-tech text-sm tracking-widest mb-6">{user?.email || 'N/A'}</p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-xs tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> KYC VERIFIED
          </div>
        </div>

        <div className="bg-heritage-900 border border-heritage-800 rounded-3xl p-8 shadow-2xl font-tech">
          <h3 className="text-lg font-brand text-slate-100 mb-6 tracking-wide border-b border-heritage-800 pb-4">TRAVEL METRICS</h3>
          {isLoading ? (
            <p className="text-slate-500 text-sm">Loading metrics...</p>
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

      {/* Right Column: Details & Saved Data */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-2/3 flex flex-col gap-6">
        <div className="bg-heritage-900 border border-heritage-800 rounded-3xl p-8 shadow-2xl font-tech flex-grow">
          <div className="flex justify-between items-center border-b border-heritage-800 pb-4 mb-6">
            <h3 className="text-xl font-brand text-slate-100 tracking-wide">SAVED PASSENGERS</h3>
            <button className="text-orange-500 hover:text-orange-400 text-sm font-bold tracking-widest transition-colors">+ ADD NEW</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? (
              <p className="text-slate-500">Loading saved passengers...</p>
            ) : savedPassengers.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No saved passengers found.</p>
            ) : (
              savedPassengers.map((p, index) => (
                <div key={index} className="bg-heritage-950 border border-heritage-800 p-5 rounded-xl hover:border-orange-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-slate-100">{p.name}</h4>
                    <button className="text-slate-500 hover:text-red-400 transition-colors">✕</button>
                  </div>
                  <p className="text-sm text-slate-400">Age: {p.age} | Gender: {p.gender}</p>
                  <p className="text-sm text-slate-400 mt-1">Berth Pref: <span className="text-slate-200">{p.pref}</span></p>
                </div>
              ))
            )}
          </div>

          <div className="mt-10 border-t border-heritage-800 pt-8">
            <h3 className="text-xl font-brand text-slate-100 tracking-wide mb-6">ACCOUNT SETTINGS</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-6 py-4 rounded-xl bg-heritage-950 border border-heritage-800 text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-colors font-semibold tracking-wide">
                CHANGE PASSWORD
              </button>
              <button className="w-full text-left px-6 py-4 rounded-xl bg-heritage-950 border border-heritage-800 text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-colors font-semibold tracking-wide">
                UPDATE CONTACT DETAILS
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;