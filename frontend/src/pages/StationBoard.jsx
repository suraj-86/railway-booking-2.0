import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StationBoard = () => {
  // Mock data for a station's live departures
  const stationName = "NEW DELHI (NDLS)";
  const boardData = [
    { train: "12952 RAJDHANI EXP", dest: "MUMBAI (BCT)", scheduled: "16:30", expected: "16:30", platform: "3", status: "ON TIME" },
    { train: "12004 SHATABDI EXP", dest: "LUCKNOW (LKO)", scheduled: "17:15", expected: "17:45", platform: "9", status: "DELAYED" },
    { train: "12260 DURONTO EXP", dest: "SEALDAH (SDAH)", scheduled: "19:40", expected: "19:40", platform: "5", status: "ON TIME" },
    { train: "12424 RAJDHANI EXP", dest: "DIBRUGARH (DBRG)", scheduled: "20:10", expected: "20:10", platform: "12", status: "ON TIME" },
    { train: "12958 SWARNA JAYANTI", dest: "AHMEDABAD (ADI)", scheduled: "21:05", expected: "21:30", platform: "4", status: "DELAYED" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 font-tech">
      <div className="flex justify-between items-end mb-8 border-b border-heritage-900 pb-4">
        <div>
          <h2 className="text-3xl font-brand text-slate-100 uppercase tracking-wide">
            STATION <span className="text-orange-500">BOARD</span>
          </h2>
          <p className="text-slate-400 mt-2">Live Departures from {stationName}</p>
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
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-heritage-900 border-b-2 border-heritage-800 text-slate-400 text-sm tracking-widest uppercase">
                <th className="p-6 font-semibold">Train Number & Name</th>
                <th className="p-6 font-semibold">Destination</th>
                <th className="p-6 font-semibold text-center">Scheduled</th>
                <th className="p-6 font-semibold text-center">Expected</th>
                <th className="p-6 font-semibold text-center">Platform</th>
                <th className="p-6 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-heritage-900">
              {boardData.map((row, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                  key={index} className="hover:bg-heritage-900/50 transition-colors group"
                >
                  <td className="p-6">
                    <span className="text-orange-500 font-brand text-lg">{row.train.split(' ')[0]}</span>
                    <span className="ml-3 text-slate-100 font-bold tracking-wide">{row.train.substring(row.train.indexOf(' ') + 1)}</span>
                  </td>
                  <td className="p-6 text-slate-300 font-bold">{row.dest}</td>
                  <td className="p-6 text-center text-slate-400">{row.scheduled}</td>
                  <td className="p-6 text-center">
                    <span className={`font-bold ${row.scheduled === row.expected ? 'text-green-400' : 'text-red-400'}`}>{row.expected}</span>
                  </td>
                  <td className="p-6 text-center">
                    <span className="w-10 h-10 inline-flex items-center justify-center bg-heritage-900 border border-heritage-800 rounded-lg text-slate-100 font-bold group-hover:border-orange-500 transition-colors">
                      {row.platform}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider border ${row.status === 'ON TIME' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'}`}>
                      {row.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StationBoard;