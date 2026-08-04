import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const formatTime = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDuration = (departureISO, arrivalISO) => {
  const diffMs = new Date(arrivalISO) - new Date(departureISO);
  const totalMinutes = Math.round(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  const [trains, setTrains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrains = async () => {
      setIsLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (source) params.set('source', source);
        if (destination) params.set('destination', destination);
        if (date) params.set('date', date);

        const response = await fetch(`${API_BASE_URL}/api/trains?${params.toString()}`);
        const data = await response.json();

        if (response.ok) {
          setTrains(data.trains);
        } else {
          setError(data.error || 'Failed to load trains.');
        }
      } catch (err) {
        console.error('Fetch trains failed:', err);
        setError('Could not reach the server. Is the backend running?');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrains();
  }, [source, destination, date]);

  return (
    <div className="max-w-5xl mx-auto py-8">

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end mb-8 border-b border-heritage-900 pb-4"
      >
        <div>
          <h2 className="text-3xl font-brand text-slate-100 uppercase tracking-wide">
            {source || 'ANY'} <span className="text-orange-500">→</span> {destination || 'ANY'}
          </h2>
          <p className="text-slate-400 font-tech mt-2">
            {isLoading ? 'Searching...' : `Showing ${trains.length} train${trains.length === 1 ? '' : 's'}${date ? ` for ${date}` : ''}.`}
          </p>
        </div>
        <Link to="/dashboard" className="text-orange-500 font-tech hover:text-orange-400 border border-heritage-900 px-4 py-2 rounded-lg hover:border-orange-500 transition-colors">
          MODIFY SEARCH
        </Link>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-900 text-red-400 font-tech text-sm">
          {error}
        </div>
      )}

      {/* Train List */}
      {!isLoading && !error && trains.length === 0 ? (
        <p className="text-slate-400 font-tech">No trains found for this route{date ? ' and date' : ''}. Try a different search.</p>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {trains.map((train) => {
            const isAvailable = train.availableSeats > 0;
            return (
              <motion.div key={train.id} variants={itemVariants} className="bg-heritage-900/40 border border-heritage-900 rounded-2xl p-6 hover:border-orange-500/50 transition-colors">

                {/* Train Info Top Row */}
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-brand text-orange-500 tracking-wide">{train.name.toUpperCase()}</h3>
                    <p className="text-slate-400 font-tech text-sm tracking-widest mt-1">
                      TRAIN NO: {train.trainNumber} &middot; {train.source.code} → {train.destination.code}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 mt-4 md:mt-0 font-tech">
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-100">{formatTime(train.departure)}</div>
                      <div className="text-xs text-slate-400">DEPART</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-slate-500">{formatDuration(train.departure, train.arrival)}</div>
                      <div className="w-16 h-px bg-heritage-800 my-1 relative">
                        <div className="absolute w-2 h-2 bg-orange-600 rounded-full -top-0.75 left-1/2 -translate-x-1/2"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-100">{formatTime(train.arrival)}</div>
                      <div className="text-xs text-slate-400">ARRIVE</div>
                    </div>
                  </div>
                </div>

                {/* Seat Availability + Price + Book */}
                <div
                  onClick={() => isAvailable && navigate(`/book?trainId=${train.id}`)}
                  className={`font-tech p-4 rounded-xl border flex justify-between items-center ${isAvailable ? 'border-heritage-800 bg-heritage-950 hover:border-orange-500 cursor-pointer' : 'border-heritage-900 bg-heritage-900/30 opacity-50 cursor-not-allowed'} transition-colors`}
                >
                  <div className="flex items-center gap-6">
                    <span className={`text-sm font-bold ${isAvailable ? (train.availableSeats < 20 ? 'text-red-400' : 'text-green-400') : 'text-slate-500'}`}>
                      {isAvailable ? `${train.availableSeats} SEATS AVAILABLE` : 'FULLY BOOKED'}
                    </span>
                    <span className="text-slate-400 text-sm">₹{train.pricePerSeat}/seat</span>
                  </div>
                  {isAvailable && <span className="text-orange-500 font-bold">BOOK NOW →</span>}
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default SearchResults;
