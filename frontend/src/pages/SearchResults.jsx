import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const dummyTrains = [
  {
    id: 1,
    name: "RAJDHANI EXPRESS",
    number: "12951",
    departure: "16:30",
    arrival: "08:15",
    duration: "15h 45m",
    classes: [
      { type: "3A", price: "₹2,150", available: true, seats: 42 },
      { type: "2A", price: "₹3,050", available: true, seats: 12 },
      { type: "1A", price: "₹5,100", available: false, seats: 0 }
    ]
  },
  {
    id: 2,
    name: "TEJAS RAJDHANI",
    number: "12953",
    departure: "17:10",
    arrival: "10:50",
    duration: "17h 40m",
    classes: [
      { type: "3A", price: "₹2,050", available: true, seats: 108 },
      { type: "2A", price: "₹2,950", available: true, seats: 24 },
      { type: "1A", price: "₹4,900", available: true, seats: 4 }
    ]
  },
  {
    id: 3,
    name: "GARIB RATH",
    number: "12215",
    departure: "09:20",
    arrival: "07:35",
    duration: "22h 15m",
    classes: [
      { type: "3A", price: "₹1,050", available: true, seats: 215 }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const SearchResults = () => {
  const navigate = useNavigate();

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
            NEW DELHI <span className="text-orange-500">→</span> MUMBAI
          </h2>
          <p className="text-slate-400 font-tech mt-2">Showing {dummyTrains.length} trains for your selected date.</p>
        </div>
        <Link to="/dashboard" className="text-orange-500 font-tech hover:text-orange-400 border border-heritage-900 px-4 py-2 rounded-lg hover:border-orange-500 transition-colors">
          MODIFY SEARCH
        </Link>
      </motion.div>

      {/* Train List */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {dummyTrains.map((train) => (
          <motion.div key={train.id} variants={itemVariants} className="bg-heritage-900/40 border border-heritage-900 rounded-2xl p-6 hover:border-orange-500/50 transition-colors">
            
            {/* Train Info Top Row */}
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
              <div>
                <h3 className="text-2xl font-brand text-orange-500 tracking-wide">{train.name}</h3>
                <p className="text-slate-400 font-tech text-sm tracking-widest mt-1">TRAIN NO: {train.number}</p>
              </div>
              
              <div className="flex items-center space-x-6 mt-4 md:mt-0 font-tech">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-100">{train.departure}</div>
                  <div className="text-xs text-slate-400">DEPART</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-slate-500">{train.duration}</div>
                  <div className="w-16 h-px bg-heritage-800 my-1 relative">
                    <div className="absolute w-2 h-2 bg-orange-600 rounded-full -top-0.75 left-1/2 -translate-x-1/2"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-100">{train.arrival}</div>
                  <div className="text-xs text-slate-400">ARRIVE</div>
                </div>
              </div>
            </div>

            {/* Class Cards */}
            <div className="flex flex-wrap gap-4 font-tech">
              {train.classes.map((cls, index) => (
                <div 
                  key={index} 
                  onClick={() => cls.available && navigate('/book')}
                  className={`flex-1 min-w-37.5 p-4 rounded-xl border ${cls.available ? 'border-heritage-800 bg-heritage-950 hover:border-orange-500 cursor-pointer' : 'border-heritage-900 bg-heritage-900/30 opacity-50 cursor-not-allowed'} transition-colors`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-200">{cls.type}</span>
                    <span className="text-orange-500 font-bold">{cls.price}</span>
                  </div>
                  <div className={`text-sm ${cls.available ? (cls.seats < 20 ? 'text-red-400' : 'text-green-400') : 'text-slate-500'}`}>
                    {cls.available ? `AVAILABLE - ${cls.seats}` : 'WAITLIST'}
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SearchResults;