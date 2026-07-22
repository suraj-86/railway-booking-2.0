import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // FUTURE BACKEND API HANDLER
  useEffect(() => {
    const fetchBookings = async () => {
      // TODO: Uncomment when backend is ready
      /*
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/user/${user?.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('railway_token')}` }
        });
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings", error);
      } finally {
        setIsLoading(false);
      }
      */
      setIsLoading(false); // Remove this once API is connected
    };

    if (user) fetchBookings();
  }, [user]);

  // Filter logic for tabs
  const displayBookings = bookings.filter(b => 
    activeTab === 'upcoming' 
      ? ['CONFIRMED', 'WAITLISTED'].includes(b.status)
      : ['COMPLETED', 'CANCELLED'].includes(b.status)
  );

  return (
    <div className="max-w-5xl mx-auto py-8 lg:py-12 min-h-[75vh]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-heritage-900 pb-4">
        <div>
          <h2 className="text-3xl font-brand text-slate-100 uppercase tracking-wide">
            MY <span className="text-orange-500">BOOKINGS</span>
          </h2>
          <p className="text-slate-400 font-tech mt-2">Manage your active and past journeys.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-6 md:mt-0 font-tech bg-heritage-900 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 rounded-md font-bold tracking-wider transition-colors ${activeTab === 'upcoming' ? 'bg-orange-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
          >
            UPCOMING
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2 rounded-md font-bold tracking-wider transition-colors ${activeTab === 'past' ? 'bg-heritage-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
          >
            PAST TRIPS
          </button>
        </div>
      </div>
      
      <div className="space-y-6 font-tech">
        {isLoading ? (
          <div className="text-center py-20 bg-heritage-900/30 rounded-3xl border border-dashed border-heritage-800">
            <p className="text-slate-400 text-lg animate-pulse">Syncing with server...</p>
          </div>
        ) : displayBookings.length === 0 ? (
          <div className="text-center py-20 bg-heritage-900/30 rounded-3xl border border-dashed border-heritage-800">
            <p className="text-slate-500 text-lg italic">No bookings found in this category.</p>
          </div>
        ) : (
          displayBookings.map((b, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} 
              className="bg-heritage-900/50 border border-heritage-800 rounded-2xl p-6 hover:border-orange-500/30 transition-colors shadow-lg"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                
                {/* Info Block */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider border mb-3 
                        ${b.status === 'CONFIRMED' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                          b.status === 'CANCELLED' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 
                          'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}
                      >
                        {b.status}
                      </span>
                      <h3 className="text-2xl font-brand text-slate-100 uppercase tracking-wide">{b.train.name}</h3>
                      <p className="text-slate-400 font-bold tracking-widest text-sm mt-1">PNR: <span className="text-slate-200">{b.pnr}</span></p>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div className="flex items-center gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-100">{new Date(b.train.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-slate-500 text-sm font-brand">{b.train.source}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-4">
                      <p className="text-xs text-orange-500 font-bold mb-1">{new Date(b.train.departure).toLocaleDateString()}</p>
                      <div className="w-full h-[1px] bg-heritage-700 relative">
                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full -top-[3px] left-1/2 -translate-x-1/2"></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{b.seats.length} Pax</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-100">{new Date(b.train.arrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-slate-500 text-sm font-brand">{b.train.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Actions Block */}
                <div className="flex flex-row lg:flex-col justify-end gap-3 border-t lg:border-t-0 lg:border-l border-heritage-800 pt-4 lg:pt-0 lg:pl-6">
                  {b.status === 'CONFIRMED' && (
                    <>
                      <button className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-heritage-950 border border-heritage-700 text-slate-200 font-bold tracking-wider hover:border-orange-500 transition-colors text-sm">
                        E-TICKET
                      </button>
                      <button className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 font-bold tracking-wider hover:bg-red-900/50 transition-colors text-sm">
                        CANCEL
                      </button>
                    </>
                  )}
                  {b.status === 'COMPLETED' && (
                    <button className="w-full px-6 py-3 rounded-xl bg-heritage-950 border border-heritage-700 text-slate-400 font-bold tracking-wider hover:text-slate-200 transition-colors text-sm">
                      VIEW INVOICE
                    </button>
                  )}
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