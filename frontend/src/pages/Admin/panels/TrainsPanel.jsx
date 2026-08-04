import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { API_BASE_URL } from '../../../config/api.js';

const emptyForm = {
  trainNumber: '', name: '', sourceId: '', destinationId: '',
  departure: '', arrival: '', totalSeats: 72, price: 500 
};

const toLocalInputValue = (isoString) => {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const TrainsPanel = () => {
  const { token } = useContext(AuthContext);
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState('add'); 
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [trainsRes, stationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/trains`),
        fetch(`${API_BASE_URL}/api/stations`)
      ]);
      const trainsData = await trainsRes.json();
      const stationsData = await stationsRes.json();
      if (trainsRes.ok) setTrains(trainsData.trains);
      if (stationsRes.ok) setStations(stationsData.stations);
      if (!trainsRes.ok || !stationsRes.ok) {
        setError(trainsData.error || stationsData.error || 'Failed to load data.');
      }
    } catch (err) {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startEdit = (train) => {
    setMode('edit');
    setEditingId(train.id);
    setForm({
      trainNumber: train.trainNumber,
      name: train.name,
      sourceId: train.sourceId,
      destinationId: train.destinationId,
      departure: toLocalInputValue(train.departure),
      arrival: toLocalInputValue(train.arrival),
      totalSeats: train.totalSeats,
      price: train.price || 500
    });
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setMode('add');
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.sourceId === form.destinationId) {
      setError('Source and destination must be different stations.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEdit = mode === 'edit';
      const url = isEdit ? `${API_BASE_URL}/api/trains/${editingId}` : `${API_BASE_URL}/api/trains`;
      const method = isEdit ? 'PUT' : 'POST';

      // Ensure price is parsed as an integer and sent in the payload
      const body = isEdit
        ? {
            name: form.name,
            sourceId: form.sourceId,
            destinationId: form.destinationId,
            departure: new Date(form.departure).toISOString(),
            arrival: new Date(form.arrival).toISOString()
          }
        : {
            trainNumber: form.trainNumber,
            name: form.name,
            sourceId: form.sourceId,
            destinationId: form.destinationId,
            departure: new Date(form.departure).toISOString(),
            arrival: new Date(form.arrival).toISOString(),
            totalSeats: parseInt(form.totalSeats, 10),
            price: parseInt(form.price, 10) 
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Failed to ${isEdit ? 'update' : 'add'} train.`);
        return;
      }

      setSuccess(isEdit ? 'Train updated successfully.' : `"${data.train.name}" added with ${form.totalSeats} seats generated.`);
      cancelEdit();
      fetchData();
    } catch (err) {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this train? This cannot be undone.')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/trains/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to delete train.');
        return;
      }
      setTrains((prev) => prev.filter((t) => t.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError('Could not reach the server. Is the backend running?');
    }
  };

  if (isLoading) return <p className="text-slate-400">Loading trains...</p>;
  if (stations.length < 2) return <p className="text-slate-300">You need at least 2 stations before you can add a train — switch to the Stations tab first.</p>;

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-950/50 border border-red-900 text-red-400 font-semibold tracking-wide text-sm">
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-green-950/50 border border-green-900 text-green-400 font-semibold tracking-wide text-sm">
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="bg-heritage-900/40 border border-heritage-900 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100">{mode === 'edit' ? 'Edit Train' : 'Add Train'}</h3>
          {mode === 'edit' && (
            <button type="button" onClick={cancelEdit} className="text-slate-400 hover:text-slate-200 text-sm font-semibold">
              Cancel edit
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">TRAIN NUMBER</label>
            <input
              type="text" required disabled={mode === 'edit'} value={form.trainNumber}
              onChange={(e) => setForm({ ...form, trainNumber: e.target.value })}
              placeholder="e.g. 12951"
              className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">TRAIN NAME</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Rajdhani Express"
              className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">SOURCE STATION</label>
            <select
              required value={form.sourceId} onChange={(e) => setForm({ ...form, sourceId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500"
            >
              <option value="" disabled>Select station</option>
              {stations.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">DESTINATION STATION</label>
            <select
              required value={form.destinationId} onChange={(e) => setForm({ ...form, destinationId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500"
            >
              <option value="" disabled>Select station</option>
              {stations.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">DEPARTURE</label>
            <input
              type="datetime-local" required value={form.departure}
              onChange={(e) => setForm({ ...form, departure: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">ARRIVAL</label>
            <input
              type="datetime-local" required value={form.arrival}
              onChange={(e) => setForm({ ...form, arrival: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">TOTAL SEATS</label>
            <input
              type="number" required disabled={mode === 'edit'} min={8} step={8} value={form.totalSeats}
              onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold tracking-wide mb-2 text-sm">PRICE PER SEAT (₹)</label>
            <input
              type="number" required disabled={mode === 'edit'} min={1} value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 disabled:opacity-50"
            />
          </div>
        </div>
        
        {mode === 'edit' && (
          <p className="text-slate-500 text-xs mt-2">Seat count and price can't be changed after creation. Delete and re-add the train if you need different values.</p>
        )}

        <button
          type="submit" disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-orange-600 text-slate-100 font-brand tracking-widest hover:shadow-lg hover:shadow-orange-950/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? (mode === 'edit' ? 'SAVING...' : 'ADDING...') : (mode === 'edit' ? 'SAVE CHANGES' : 'ADD TRAIN')}
        </button>
      </form>

      {trains.length === 0 ? (
        <p className="text-slate-400">No trains yet — add one above.</p>
      ) : (
        <div className="space-y-3">
          {trains.map((train) => (
            <div key={train.id} className="flex items-center justify-between bg-heritage-900/40 border border-heritage-900 rounded-xl px-6 py-4">
              <div>
                <p className="text-slate-100 font-bold">{train.name} <span className="text-slate-500 font-normal">#{train.trainNumber}</span></p>
                <p className="text-slate-400 text-sm">{train.source.code} → {train.destination.code} &middot; {train.totalSeats} seats &middot; ₹{train.price}</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => startEdit(train)} className="text-orange-500 hover:text-orange-400 text-sm font-bold tracking-wide">EDIT</button>
                <button onClick={() => handleDelete(train.id)} className="text-red-400 hover:text-red-300 text-sm font-bold tracking-wide">DELETE</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainsPanel;
