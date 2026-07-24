import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { API_BASE_URL } from '../../../config/api.js';

const StationsPanel = () => {
  const { token } = useContext(AuthContext);

  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/stations`);
      const data = await response.json();
      if (response.ok) {
        setStations(data.stations);
      } else {
        setError(data.error || 'Failed to load stations.');
      }
    } catch (err) {
      console.error('Fetch stations failed:', err);
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleAddStation = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/stations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code, name, city })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add station.');
        return;
      }

      setCode('');
      setName('');
      setCity('');
      fetchStations();

    } catch (err) {
      console.error('Add station failed:', err);
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this station?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/stations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to delete station.');
        return;
      }

      setStations((prev) => prev.filter((s) => s.id !== id));

    } catch (err) {
      console.error('Delete station failed:', err);
      setError('Could not reach the server. Is the backend running?');
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-950/50 border border-red-900 text-red-400 font-semibold tracking-wide text-sm">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleAddStation} className="bg-heritage-900/40 border border-heritage-900 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">CODE</label>
          <input
            type="text" required value={code} onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. NDLS" maxLength={10}
            className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">NAME</label>
          <input
            type="text" required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. New Delhi"
            className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">CITY</label>
          <input
            type="text" required value={city} onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Delhi"
            className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <button
          type="submit" disabled={isSubmitting}
          className="px-6 py-3 rounded-xl bg-orange-600 text-slate-100 font-brand tracking-widest hover:shadow-lg hover:shadow-orange-950/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'ADDING...' : 'ADD'}
        </button>
      </form>

      {isLoading ? (
        <p className="text-slate-400">Loading stations...</p>
      ) : stations.length === 0 ? (
        <p className="text-slate-400">No stations yet — add one above to get started.</p>
      ) : (
        <div className="space-y-3">
          {stations.map((station) => (
            <div key={station.id} className="flex items-center justify-between bg-heritage-900/40 border border-heritage-900 rounded-xl px-6 py-4">
              <div className="flex items-center gap-6">
                <span className="text-orange-500 font-bold w-16">{station.code}</span>
                <span className="text-slate-100">{station.name}</span>
                <span className="text-slate-400 text-sm">{station.city}</span>
              </div>
              <button onClick={() => handleDelete(station.id)} className="text-red-400 hover:text-red-300 text-sm font-bold tracking-wide transition-colors">
                DELETE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StationsPanel;
