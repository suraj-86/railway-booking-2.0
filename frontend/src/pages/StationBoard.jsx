import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const StationBoard = () => {
  const [trains, setTrains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/trains`);
        const data = await response.json();
        if (response.ok) {
          setTrains(data.trains || []);
        }
      } catch (err) {
        console.error("Failed to load station board", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 font-tech">
      <div className="flex justify-between items-end mb-8 border-b border-heritage-900 pb-4">
        <div>
          <h2 className="text-3xl font-brand text-slate-100 uppercase tracking-wide">
            STATION <span className="text-orange-500">BOARD</span>
          </h2>
          <p className="text-slate-400 mt-2">Live Master Schedule & Departures</p>
        </div>
        <Link to="/dashboard" className="text-orange-500 hover:text-orange-400 border border-heritage-900 px-4 py-2 rounded-lg hover:border-orange-500 transition-colors">
          BACK TO DASHBOARD
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-heritage-950 border-2 border-heritage-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-16 text-slate-400">Loading live station data...</div>
          ) : trains.length === 0 ? (
            <div className="text-center py-16 text-slate-500 italic">No scheduled departures found.</div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-heritage-900 border-b-2 border-heritage-800 text-slate-400 text-sm tracking-widest uppercase">
                  <th className="p-6 font-semibold">Train Number & Name</th>
                  <th className="p-6 font-semibold">Origin → Destination</th>
                  <th className="p-6 font-semibold text-center">Departure</th>
                  <th className="p-6 font-semibold text-center">Arrival</th>
                  <th className="p-6 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-900">
                {trains.map((row, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                    key={row.id} className="hover:bg-heritage-900/50 transition-colors group"
                  >
                    <td className="p-6">
                      <span className="text-orange-500 font-brand text-lg">{row.trainNumber}</span>
                      <span className="ml-3 text-slate-100 font-bold tracking-wide">{row.name}</span>
                    </td>
                    <td className="p-6 text-slate-300 font-bold">
                      {row.source?.code || 'SRC'} <span className="text-orange-500">→</span> {row.destination?.code || 'DEST'}
                    </td>
                    <td className="p-6 text-center text-slate-300">
                      {new Date(row.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-6 text-center text-slate-300">
                      {new Date(row.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-6 text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider border bg-green-500/10 border-green-500/30 text-green-400">
                        ON TIME
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StationBoard;