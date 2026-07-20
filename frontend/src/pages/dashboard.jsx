import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchType, setSearchType] = useState('route'); 

  return (
    <div className="flex justify-center items-center min-h-[85vh] py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-12 bg-heritage-900/50 rounded-3xl shadow-2xl border border-heritage-900 w-full max-w-7xl overflow-hidden"
      >
        {/* LEFT PANEL: SEARCH HUB */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:col-span-8 bg-heritage-950 p-10 flex flex-col font-tech">
          
          {/* Search Tabs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 border-b border-heritage-900 pb-4 mb-8">
            <button onClick={() => setSearchType('route')} className={`text-sm md:text-lg font-brand tracking-wide px-4 py-2 rounded-lg transition-colors ${searchType === 'route' ? 'bg-orange-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}>ROUTE SEARCH</button>
            <button onClick={() => setSearchType('train')} className={`text-sm md:text-lg font-brand tracking-wide px-4 py-2 rounded-lg transition-colors ${searchType === 'train' ? 'bg-orange-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}>TRAIN SEARCH</button>
            <button onClick={() => setSearchType('station')} className={`text-sm md:text-lg font-brand tracking-wide px-4 py-2 rounded-lg transition-colors ${searchType === 'station' ? 'bg-orange-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}>STATION SEARCH</button>
          </motion.div>

          {/* Dynamic Search Forms */}
          <motion.div variants={itemVariants} className="grow">
            {searchType === 'route' && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 font-semibold tracking-wide mb-2">FROM STATION</label>
                    <input type="text" className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="e.g., New Delhi (NDLS)" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold tracking-wide mb-2">TO STATION</label>
                    <input type="text" className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="e.g., Mumbai Central (BCT)" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold tracking-wide mb-2">JOURNEY DATE</label>
                  <input type="date" className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl bg-orange-600 text-slate-100 font-brand text-2xl tracking-widest shadow-lg shadow-orange-950/40 hover:shadow-orange-950/70 transition-shadow duration-300 mt-4">
                  SEARCH TRAINS
                </motion.button>
              </form>
            )}

            {searchType === 'train' && (
              <form className="space-y-6">
                <div>
                  <label className="block text-slate-300 font-semibold tracking-wide mb-2">TRAIN NAME OR NUMBER</label>
                  <input type="text" className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="e.g., 12951 or Rajdhani Express" />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl bg-orange-600 text-slate-100 font-brand text-2xl tracking-widest shadow-lg shadow-orange-950/40 hover:shadow-orange-950/70 transition-shadow mt-4">
                  LOCATE TRAIN
                </motion.button>
              </form>
            )}

            {searchType === 'station' && (
              <form className="space-y-6">
                <div>
                  <label className="block text-slate-300 font-semibold tracking-wide mb-2">STATION CODE / NAME</label>
                  <input type="text" className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="e.g., NDLS" />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl bg-orange-600 text-slate-100 font-brand text-2xl tracking-widest shadow-lg shadow-orange-950/40 hover:shadow-orange-950/70 transition-shadow mt-4">
                  VIEW STATION BOARD
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Search History */}
          <motion.div variants={itemVariants} className="mt-12 border-t border-heritage-900 pt-6">
            <h3 className="text-slate-400 font-brand tracking-wider mb-4 text-sm">RECENT SEARCHES</h3>
            <div className="flex space-x-4">
              <div className="bg-heritage-900/50 px-4 py-2 rounded-lg border border-heritage-900 text-sm text-slate-300 cursor-pointer hover:border-orange-500 transition-colors">
                NDLS → BCT
              </div>
              <div className="bg-heritage-900/50 px-4 py-2 rounded-lg border border-heritage-900 text-sm text-slate-300 cursor-pointer hover:border-orange-500 transition-colors">
                Train 12951
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL: USER HUB */}
        <div className="md:col-span-4 bg-heritage-900 p-10 flex flex-col border-l border-heritage-900">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-brand text-slate-100 tracking-wide uppercase">
              WELCOME, <br/><span className="text-orange-500">{user?.name || 'PASSENGER'}</span>
            </h2>
            <p className="text-slate-400 font-tech mt-2">Ready for your next departure?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 grow content-start font-tech">
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSearchType('route')} className="bg-heritage-950 p-6 rounded-xl border border-heritage-800 hover:border-orange-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-3xl mb-2">🎫</span>
              <span className="text-slate-200 font-bold tracking-wide text-sm">BOOK TICKET</span>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} className="bg-heritage-950 p-6 rounded-xl border border-heritage-800 hover:border-orange-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-3xl mb-2">📋</span>
              <span className="text-slate-200 font-bold tracking-wide text-sm">MY BOOKINGS</span>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} className="bg-heritage-950 p-6 rounded-xl border border-heritage-800 hover:border-orange-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-3xl mb-2">🔍</span>
              <span className="text-slate-200 font-bold tracking-wide text-sm">PNR ENQUIRY</span>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} className="bg-heritage-950 p-6 rounded-xl border border-heritage-800 hover:border-red-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-3xl mb-2">❌</span>
              <span className="text-slate-200 font-bold tracking-wide text-sm">CANCEL TICKET</span>
            </motion.div>
          </div>
        </div>
        
      </motion.div>
    </div>
  );
};

export default Dashboard;