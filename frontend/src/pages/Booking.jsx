import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { API_BASE_URL } from '../config/api.js';

const MAX_SEATS = 6;

const formatTime = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trainId = searchParams.get('trainId');
  const { user, token } = useContext(AuthContext);

  const [train, setTrain] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Not logged in? Booking needs a real user account.
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!trainId) {
      setError('No train selected. Go back and pick a train from search results.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [trainRes, seatsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/trains/${trainId}`),
          fetch(`${API_BASE_URL}/api/trains/${trainId}/seats`)
        ]);
        const trainData = await trainRes.json();
        const seatsData = await seatsRes.json();

        if (!trainRes.ok) {
          setError(trainData.error || 'Train not found.');
          return;
        }
        if (!seatsRes.ok) {
          setError(seatsData.error || 'Failed to load seat map.');
          return;
        }

        setTrain(trainData.train);
        setSeats(seatsData.seats);
      } catch (err) {
        console.error('Fetch train/seats failed:', err);
        setError('Could not reach the server. Is the backend running?');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [trainId]);

  const toggleSeat = (seat) => {
    if (seat.isBooked) return;

    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      }
      if (prev.length >= MAX_SEATS) {
        return prev; // silently ignore past the cap — button below explains the limit
      }
      return [...prev, seat.id];
    });
  };

  const handleConfirmBooking = async () => {
    if (selectedSeatIds.length === 0) return;
    setIsBooking(true);
    setError('');

    try {
      const totalAmount = selectedSeatIds.length * train.pricePerSeat;

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ trainId, seatIds: selectedSeatIds, totalAmount })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Booking failed.');
        // Someone may have grabbed a seat between us loading the page and
        // clicking confirm — refresh the seat map so the UI reflects reality.
        const seatsRes = await fetch(`${API_BASE_URL}/api/trains/${trainId}/seats`);
        const seatsData = await seatsRes.json();
        if (seatsRes.ok) {
          setSeats(seatsData.seats);
          setSelectedSeatIds([]);
        }
        return;
      }

      navigate('/confirmation', { state: { booking: data.booking, train } });

    } catch (err) {
      console.error('Booking failed:', err);
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return <p className="text-slate-400 font-tech max-w-4xl mx-auto py-8">Loading train details...</p>;
  }

  if (error && !train) {
    return (
      <div className="max-w-4xl mx-auto py-8 font-tech">
        <p className="text-red-400 mb-4">{error}</p>
        <Link to="/dashboard" className="text-orange-500 hover:text-orange-400 font-bold">← Back to search</Link>
      </div>
    );
  }

  // Group seats by coach for a clean visual layout
  const seatsByCoach = seats.reduce((acc, seat) => {
    if (!acc[seat.coach]) acc[seat.coach] = [];
    acc[seat.coach].push(seat);
    return acc;
  }, {});

  const totalAmount = selectedSeatIds.length * (train?.pricePerSeat || 0);

  return (
    <div className="max-w-4xl mx-auto py-8 font-tech">

      {/* Journey Summary Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-heritage-900/40 border border-orange-500/50 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center"
      >
        <div>
          <h2 className="text-2xl font-brand text-slate-100 uppercase tracking-wide">
            {train.name.toUpperCase()} <span className="text-orange-500">| {train.trainNumber}</span>
          </h2>
          <p className="text-slate-400 mt-1">
            {train.source.code} → {train.destination.code} &middot; {formatTime(train.departure)} → {formatTime(train.arrival)}
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <div className="text-3xl font-bold text-orange-500">₹{totalAmount}</div>
          <div className="text-sm text-slate-400">{selectedSeatIds.length} seat{selectedSeatIds.length === 1 ? '' : 's'} selected</div>
        </div>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-900 text-red-400 text-sm">{error}</div>
      )}

      {/* Seat Map */}
      <div className="mb-8">
        <div className="flex justify-between items-end border-b border-heritage-900 pb-4 mb-6">
          <h3 className="text-xl font-brand text-slate-100 tracking-wider">SELECT SEATS</h3>
          <span className="text-sm text-slate-400">Max {MAX_SEATS} seats per booking</span>
        </div>

        <div className="flex gap-6 mb-4 text-xs text-slate-400">
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-heritage-800 border border-heritage-700 inline-block" /> Available</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-orange-600 inline-block" /> Selected</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-heritage-900 border border-heritage-900 inline-block opacity-50" /> Booked</span>
        </div>

        <div className="space-y-6">
          {Object.entries(seatsByCoach).map(([coach, coachSeats]) => (
            <div key={coach}>
              <p className="text-slate-500 text-sm font-bold mb-2">COACH {coach}</p>
              <div className="grid grid-cols-8 gap-2">
                {coachSeats.map((seat) => {
                  const isSelected = selectedSeatIds.includes(seat.id);
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => toggleSeat(seat)}
                      disabled={seat.isBooked}
                      title={`${seat.type} · Seat ${seat.seatNumber}`}
                      className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-colors
                        ${seat.isBooked
                          ? 'bg-heritage-900 border border-heritage-900 text-slate-600 opacity-50 cursor-not-allowed'
                          : isSelected
                            ? 'bg-orange-600 text-slate-100'
                            : 'bg-heritage-800 border border-heritage-700 text-slate-300 hover:border-orange-500 cursor-pointer'
                        }`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm */}
      <motion.button
        whileHover={{ scale: selectedSeatIds.length > 0 ? 1.02 : 1 }}
        whileTap={{ scale: selectedSeatIds.length > 0 ? 0.98 : 1 }}
        onClick={handleConfirmBooking}
        disabled={selectedSeatIds.length === 0 || isBooking}
        className="w-full py-4 rounded-xl bg-orange-600 text-slate-100 font-brand text-2xl tracking-widest shadow-lg shadow-orange-950/40 hover:shadow-orange-950/70 transition-shadow duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-orange-950/40"
      >
        {isBooking ? 'BOOKING...' : selectedSeatIds.length === 0 ? 'SELECT AT LEAST 1 SEAT' : `CONFIRM BOOKING — ₹${totalAmount}`}
      </motion.button>
    </div>
  );
};

export default Booking;
