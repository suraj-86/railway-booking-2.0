import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TrainStatus = () => {
  // Mock data for a live train timeline
  const trainData = {
    name: "RAJDHANI EXPRESS",
    number: "12951",
    currentStatus: "ON TIME",
    lastUpdated: "Just Now",
    route: [
      { station: "Mumbai Central (BCT)", time: "17:00", actualTime: "17:00", status: "DEPARTED", passed: true },
      { station: "Surat (ST)", time: "19:43", actualTime: "19:45", status: "DEPARTED", passed: true },
      { station: "Vadodara Jn (BRC)", time: "21:06", actualTime: "21:06", status: "DEPARTED", passed: true },
      { station: "Ratlam Jn (RTM)", time: "00:25", actualTime: "00:28", status: "ARRIVED", passed: true, isCurrent: true },
      { station: "Kota Jn (KOTA)", time: "03:15", actualTime: "--:--", status: "UPCOMING", passed: false },
      { station: "New Delhi (NDLS)", time: "08:32", actualTime: "--:--", status: "DESTINATION", passed: false }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto py-8 font-tech">
      <div className="flex justify-between items-end mb-8 border-b border-heritage-900 pb-4">
        <div>
          <h2 className="text-3xl font-brand text-slate-100 uppercase tracking-wide">
            LIVE <span className="text-orange-500">RADAR</span>
          </h2>
          <p className="text-slate-400 mt-2">Tracking {trainData.name} ({trainData.number})</p>
        </div>
        <Link to="/dashboard" className="text-orange-500 hover:text-orange-400 border border-heritage-900 px-4 py-2 rounded-lg hover:border-orange-500 transition-colors">
          BACK TO DASHBOARD
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
        className="bg-heritage-900/40 border border-heritage-800 rounded-3xl p-8"
      >
        <div className="flex justify-between items-center bg-heritage-950 p-6 rounded-2xl border border-heritage-800 mb-10">
          <div>
            <h3 className="text-2xl font-brand text-slate-100">{trainData.name}</h3>
            <p className="text-slate-400 font-bold tracking-widest text-sm mt-1">TRAIN NO: {trainData.number}</p>
          </div>
          <div className="text-right">
            <span className="px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/50 font-bold text-sm tracking-wider">
              {trainData.currentStatus}
            </span>
            <p className="text-slate-500 text-xs mt-2">UPDATED: {trainData.lastUpdated}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-4 md:pl-8">
          <div className="absolute left-5.75 md:left-9.75 top-4 bottom-4 w-1 bg-heritage-800 rounded-full"></div>
          
          <div className="space-y-8">
            {trainData.route.map((stop, index) => (
              <div key={index} className="relative flex items-center">
                {/* Timeline Dot */}
                <div className={`absolute -left-6 md:-left-2 w-5 h-5 rounded-full border-4 border-heritage-950 z-10 
                  ${stop.isCurrent ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-pulse' : stop.passed ? 'bg-slate-500' : 'bg-heritage-800'}`} 
                ></div>
                
                <div className={`ml-8 md:ml-12 p-4 rounded-xl border flex-1 flex flex-col md:flex-row justify-between md:items-center transition-colors
                  ${stop.isCurrent ? 'bg-orange-500/10 border-orange-500/50' : stop.passed ? 'bg-heritage-950/50 border-heritage-900 opacity-60' : 'bg-heritage-950 border-heritage-900'}`}
                >
                  <div>
                    <h4 className={`text-lg font-bold ${stop.isCurrent ? 'text-orange-500' : 'text-slate-200'}`}>{stop.station}</h4>
                    <span className="text-xs font-bold tracking-wider text-slate-500">{stop.status}</span>
                  </div>
                  <div className="mt-2 md:mt-0 text-left md:text-right flex md:flex-col gap-4 md:gap-1">
                    <div>
                      <p className="text-slate-400 text-xs">SCHEDULED</p>
                      <p className="text-slate-200 font-bold">{stop.time}</p>
                    </div>
                    {stop.passed && (
                      <div>
                        <p className="text-slate-400 text-xs">ACTUAL</p>
                        <p className={`font-bold ${stop.time === stop.actualTime ? 'text-green-400' : 'text-red-400'}`}>{stop.actualTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrainStatus;