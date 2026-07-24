import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config/api';

const PnrEnquiry = () => {
  const [pnr, setPnr] = useState('');
  const [statusData, setStatusData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setStatusData(null);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/pnr/${pnr}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'PNR not found in database.');
      
      setStatusData(data.booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 lg:py-12 min-h-[75vh] font-tech">
      <h2 className="text-3xl font-brand text-slate-100 mb-8 uppercase tracking-wide">
        PNR <span className="text-orange-500">ENQUIRY</span>
      </h2>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-heritage-900 border border-heritage-800 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        {isSearching && <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="absolute top-0 left-0 h-1 w-1/2 bg-orange-500" />}
        
        <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <label className="block text-slate-400 text-xs tracking-wider mb-2">ENTER 10-DIGIT PNR NUMBER</label>
            <input 
              type="text" required maxLength="10" 
              value={pnr} onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
              className="w-full px-5 py-4 rounded-xl bg-heritage-950 border border-heritage-800 text-slate-100 focus:outline-none focus:border-orange-500 font-bold tracking-widest text-xl" 
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={pnr.length !== 10 || isSearching} className="w-full md:w-auto px-10 py-4 rounded-xl bg-orange-600 text-slate-100 font-bold hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-widest h-[62px]">
              {isSearching ? 'SCANNING DB...' : 'GET STATUS'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-400 text-sm mt-4 tracking-wide">{error}</p>}
      </motion.div>

      <AnimatePresence>
        {statusData && (
          <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-heritage-950 border border-heritage-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-heritage-900 p-6 md:p-8 border-b border-heritage-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-2xl font-brand text-slate-100">{statusData.train.name}</h3>
                <p className="text-slate-400 font-bold tracking-widest text-sm mt-1">{statusData.train.source?.code} <span className="text-orange-500 mx-2">→</span> {statusData.train.destination?.code}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-slate-300 font-bold tracking-wider">{new Date(statusData.train.departure).toLocaleDateString()}</p>
                <p className="font-bold tracking-widest text-sm mt-1 text-green-400">{statusData.status}</p>
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-heritage-800 text-slate-400 text-sm tracking-widest uppercase">
                    <th className="pb-4 font-semibold">Seat / Coach</th>
                    <th className="pb-4 font-semibold">Type</th>
                    <th className="pb-4 font-semibold">Booking Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-heritage-900/50">
                  {statusData.seats.map((seat) => (
                    <tr key={seat.id} className="hover:bg-heritage-900/30 transition-colors">
                      <td className="py-5 font-bold text-slate-200">{seat.coach} - {seat.seatNumber}</td>
                      <td className="py-5 text-slate-300 font-semibold">{seat.type}</td>
                      <td className="py-5"><span className="text-green-400 font-bold tracking-wide">CONFIRMED</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PnrEnquiry;