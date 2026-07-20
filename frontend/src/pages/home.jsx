import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const Home = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl w-full text-center space-y-10"
      >
        
        {/* System Status Tag */}
        <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-heritage-900 border border-heritage-900 text-orange-500 font-tech text-sm tracking-wider">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span>SYSTEM ONLINE // SECURE TRANSIT PROTOCOL</span>
        </motion.div>

        {/* Main Hero Header */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-brand tracking-wide text-transparent bg-clip-text bg-gradient-orange-text uppercase">
            REAL RAIL
          </h1>
          <p className="text-xl md:text-2xl font-tech text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Next-generation global train reservation engine. Built for speed, security, and precision scheduling.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
          <Link to="/register">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl bg-orange-600 text-slate-100 font-brand text-2xl tracking-widest shadow-lg shadow-orange-950/50 hover:shadow-orange-950/80 transition-shadow duration-300 w-full sm:w-auto"
            >
              INITIALIZE JOURNEY 
              [SIGN UP/REGISTER]
            </motion.button>
          </Link>
          
          <Link to="/login">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl border-2 border-heritage-900 bg-heritage-900/50 text-slate-300 font-brand text-2xl tracking-widest hover:border-orange-500 hover:text-slate-100 transition-colors duration-300 w-full sm:w-auto"
            >
              ACCESS STATION 
              [LOGIN/ENTER]
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature Grid Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <div className="bg-heritage-900/40 border border-heritage-900 p-8 rounded-2xl text-left font-tech">
            <div className="text-orange-500 font-brand text-3xl mb-3">01 // SPEED</div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Instant Allocation</h3>
            <p className="text-slate-300 text-base leading-relaxed">Lightning-fast reservation routing designed to secure tickets without friction.</p>
          </div>

          <div className="bg-heritage-900/40 border border-heritage-900 p-8 rounded-2xl text-left font-tech">
            <div className="text-orange-500 font-brand text-3xl mb-3">02 // SECURE</div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Cryptographic Tokens</h3>
            <p className="text-slate-300 text-base leading-relaxed">Protected user credentials backed by secure JWT sessions and encrypted routing.</p>
          </div>

          <div className="bg-heritage-900/40 border border-heritage-900 p-8 rounded-2xl text-left font-tech">
            <div className="text-orange-500 font-brand text-3xl mb-3">03 // PRECISION</div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Live Sync Engine</h3>
            <p className="text-slate-300 text-base leading-relaxed">Real-time status updates across departure stations and arrival terminals.</p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Home;