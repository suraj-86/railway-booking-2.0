import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

const TrainStatus = () => {
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/trains`);
        const data = await response.json();
        if (response.ok && data.trains?.length > 0) {
          setTrains(data.trains);
          setSelectedTrain(data.trains[0]); // Default to the first train
        }
      } catch (err) {
        console.error("Failed to fetch trains for radar", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrains();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 font-tech">
      <div className="flex justify-between items-end mb-8 border-b border-heritage-900 pb-4">
        <div>
          <h2 className="text-3xl font-brand text-slate-100 uppercase tracking-wide">
            LIVE <span className="text-orange-500">RADAR</span>
          </h2>
          <p className="text-slate-400 mt-2">Real-time schedule progression and tracking</p>
        </div>
        <Link to="/dashboard" className="text-orange-500 hover:text-orange-400 border border-heritage-900 px-4 py-2 rounded-lg hover:border-orange-500 transition-colors">
          BACK TO DASHBOARD
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-400">Syncing live radar data...</div>
      ) : trains.length === 0 ? (
        <div className="text-center py-20 bg-heritage-900/30 rounded-3xl border border-dashed border-heritage-800 text-slate-500">
          No active trains found in database.
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="bg-heritage-900/40 border border-heritage-800 rounded-3xl p-8"
        >
          {/* Train Selector Dropdown */}
          <div className="mb-8">
            <label className="block text-slate-400 text-xs tracking-wider mb-2">SELECT TRAIN TO TRACK</label>
            <select 
              value={selectedTrain?.id || ''} 
              onChange={(e) => setSelectedTrain(trains.find(t => t.id === e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-heritage-950 border border-heritage-800 text-slate-100 focus:outline-none focus:border-orange-500"
            >
              {trains.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.trainNumber}) — {t.source?.code} to {t.destination?.code}</option>
              ))}
            </select>
          </div>

          {selectedTrain && (
            <>
              <div className="flex justify-between items-center bg-heritage-950 p-6 rounded-2xl border border-heritage-800 mb-10">
                <div>
                  <h3 className="text-2xl font-brand text-slate-100">{selectedTrain.name}</h3>
                  <p className="text-slate-400 font-bold tracking-widest text-sm mt-1">TRAIN NO: {selectedTrain.trainNumber}</p>
                </div>
                <div className="text-right">
                  <span className="px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/50 font-bold text-sm tracking-wider">
                    ON TIME
                  </span>
                  <p className="text-slate-500 text-xs mt-2">LIVE SYNC ACTIVE</p>
                </div>
              </div>

              {/* Dynamic Timeline */}
              <div className="relative pl-4 md:pl-8">
                <div className="absolute left-5.75 md:left-9.75 top-4 bottom-4 w-1 bg-heritage-800 rounded-full"></div>
                
                <div className="space-y-8">
                  {/* Origin Stop */}
                  <div className="relative flex items-center">
                    <div className="absolute -left-6 md:-left-2 w-5 h-5 rounded-full border-4 border-heritage-950 z-10 bg-slate-500"></div>
                    <div className="ml-8 md:ml-12 p-4 rounded-xl border border-heritage-900 bg-heritage-950 flex-1 flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-bold text-slate-200">{selectedTrain.source?.name} ({selectedTrain.source?.code})</h4>
                        <span className="text-xs font-bold tracking-wider text-slate-500">ORIGIN TERMINAL</span>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">DEPARTURE</p>
                        <p className="text-slate-200 font-bold">{new Date(selectedTrain.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Destination Stop */}
                  <div className="relative flex items-center">
                    <div className="absolute -left-6 md:-left-2 w-5 h-5 rounded-full border-4 border-heritage-950 z-10 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-pulse"></div>
                    <div className="ml-8 md:ml-12 p-4 rounded-xl border border-orange-500/50 bg-orange-500/10 flex-1 flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-bold text-orange-500">{selectedTrain.destination?.name} ({selectedTrain.destination?.code})</h4>
                        <span className="text-xs font-bold tracking-wider text-orange-400">DESTINATION TERMINAL</span>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">ARRIVAL</p>
                        <p className="text-slate-200 font-bold">{new Date(selectedTrain.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TrainStatus;