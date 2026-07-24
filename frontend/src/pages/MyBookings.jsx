import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const MyBookings = () => {
  const { user, token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookings/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) setBookings(data.bookings || []);
      } catch (error) {
        console.error("Failed to load bookings", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user && token) fetchBookings();
  }, [user, token]);

  const displayBookings = bookings.filter(b => 
    activeTab === 'upcoming' 
      ? ['CONFIRMED', 'WAITLISTED'].includes(b.status)
      : ['COMPLETED', 'CANCELLED'].includes(b.status)
  );

  return (
    <div className="max-w-5xl mx-auto py-8 lg:py-12 min-h-[75vh] font-tech">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-heritage-900 pb-4">
        <div>
          <h2 className="text-3xl font-brand text-slate-100 uppercase tracking-wide">
            MY <span className="text-orange-500">BOOKINGS</span>
          </h2>
          <p className="text-slate-400 mt-2">Manage your active and past database records.</p>
        </div>
        
        <div className="flex gap-2 mt-6 md:mt-0 bg-heritage-900 p-1 rounded-lg">
          <button onClick={() => setActiveTab('upcoming')} className={`px-6 py-2 rounded-md font-bold tracking-wider transition-colors ${activeTab === 'upcoming' ? 'bg-orange-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}>
            UPCOMING
          </button>
          <button onClick={() => setActiveTab('past')} className={`px-6 py-2 rounded-md font-bold tracking-wider transition-colors ${activeTab === 'past' ? 'bg-heritage-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}>
            PAST TRIPS
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-20 bg-heritage-900/30 rounded-3xl border border-dashed border-heritage-800">
            <p className="text-slate-400 text-lg animate-pulse">Querying database...</p>
          </div>
        ) : displayBookings.length === 0 ? (
          <div className="text-center py-20 bg-heritage-900/30 rounded-3xl border border-dashed border-heritage-800">
            <p className="text-slate-500 text-lg italic">No database records found in this category.</p>
          </div>
        ) : (
          displayBookings.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-heritage-900/50 border border-heritage-800 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider border mb-3 bg-green-500/10 border-green-500/30 text-green-400">
                    {b.status}
                  </span>
                  <h3 className="text-2xl font-brand text-slate-100 uppercase tracking-wide">{b.train.name}</h3>
                  <p className="text-slate-400 font-bold tracking-widest text-sm mt-1">PNR: <span className="text-slate-200">{b.pnr}</span></p>

                  <div className="flex items-center gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-100">{new Date(b.train.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-slate-500 text-sm">{b.train.source?.code}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-4">
                      <p className="text-xs text-orange-500 font-bold mb-1">{new Date(b.train.departure).toLocaleDateString()}</p>
                      <div className="w-full h-[1px] bg-heritage-700 relative">
                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full -top-[3px] left-1/2 -translate-x-1/2"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-100">{new Date(b.train.arrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-slate-500 text-sm">{b.train.destination?.code}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;