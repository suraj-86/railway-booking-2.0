import { motion } from 'framer-motion';
import { Link, useLocation, Navigate } from 'react-router-dom';

const formatTime = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDate = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

const Confirmation = () => {
  const location = useLocation();
  const { booking, train } = location.state || {};

  if (!booking || !train) {
    return <Navigate to="/bookings" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 flex justify-center items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full bg-heritage-900 border-2 border-orange-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-orange-900/20"
      >
        {/* Ticket Header */}
        <div className="bg-orange-600 p-6 flex flex-col md:flex-row justify-between items-center text-slate-100 border-b-4 border-heritage-950">
          <div>
            <h2 className="text-3xl font-brand tracking-widest">REAL RAIL</h2>
            <p className="font-tech text-sm tracking-widest opacity-80 mt-1">E-TICKET // {booking.status}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="font-tech text-sm tracking-widest opacity-80 mb-1">PNR NUMBER</p>
            <h3 className="text-4xl font-brand tracking-widest">{booking.pnr}</h3>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8">
          {/* Main Ticket Details */}
          <div className="flex-1 space-y-8 font-tech">

            {/* Route & Timing */}
            <div className="flex justify-between items-center border-b border-heritage-800 pb-6">
              <div>
                <p className="text-slate-400 text-xs tracking-wider mb-1">DEPARTURE</p>
                <h4 className="text-2xl font-bold text-slate-100">{formatTime(train.departure)}</h4>
                <p className="text-slate-300 font-brand text-sm mt-1">{train.source.name} ({train.source.code})</p>
              </div>

              <div className="flex flex-col items-center px-4">
                <span className="text-orange-500 font-brand text-xl">→</span>
                <span className="text-slate-500 text-xs mt-1">{formatDate(train.departure)}</span>
              </div>

              <div className="text-right">
                <p className="text-slate-400 text-xs tracking-wider mb-1">ARRIVAL</p>
                <h4 className="text-2xl font-bold text-slate-100">{formatTime(train.arrival)}</h4>
                <p className="text-slate-300 font-brand text-sm mt-1">{train.destination.name} ({train.destination.code})</p>
              </div>
            </div>

            {/* Train & Seat Info */}
            <div>
              <div className="mb-6">
                <p className="text-slate-400 text-xs tracking-wider mb-1">TRAIN DETAILS</p>
                <h4 className="text-xl font-bold text-orange-500">{train.name.toUpperCase()} ({train.trainNumber})</h4>
              </div>

              <div>
                <p className="text-slate-400 text-xs tracking-wider mb-3">SEATS BOOKED</p>
                <div className="bg-heritage-950 rounded-xl p-4 border border-heritage-800 space-y-2">
                  {booking.seats.map((seat) => (
                    <div key={seat.id} className="flex justify-between items-center">
                      <p className="text-slate-100 font-bold">Coach {seat.coach}, Seat {seat.seatNumber}</p>
                      <p className="text-slate-500 text-sm">{seat.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* QR Code & Total Section */}
          <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-heritage-800 pt-8 md:pt-0 md:pl-8 font-tech">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-xs tracking-wider mb-1">TOTAL FARE</p>
              <h3 className="text-3xl font-bold text-slate-100">₹{booking.totalAmount}</h3>
              <p className="text-green-400 text-xs font-bold mt-2">PAID IN FULL</p>
            </div>

            <div className="mt-8 flex flex-col items-center">
              {/* Mock QR Code — purely decorative, no real payload */}
              <div className="bg-slate-100 p-2 rounded-lg inline-block">
                <div className="w-32 h-32 flex flex-wrap gap-1 bg-white">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}></div>
                  ))}
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-3 text-center">Scan at terminal gates for direct boarding.</p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-heritage-950 p-6 flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 rounded-lg border border-heritage-800 text-slate-300 font-bold hover:text-slate-100 hover:border-slate-500 transition-colors" disabled title="PDF export not built yet">
            DOWNLOAD PDF
          </button>
          <Link to="/dashboard">
            <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-orange-600 text-slate-100 font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-950/50">
              RETURN TO DASHBOARD
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Confirmation;
