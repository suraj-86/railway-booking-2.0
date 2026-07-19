import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext'; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (email === 'fail') {
      setError('Invalid credentials. Please verify your access codes.');
      return;
    }

    setError(''); 
    const mockUserData = { id: 1, name: 'Passenger', email: email };
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
    
    login(mockUserData, mockToken); 
    navigate('/'); 
  };

  return (
    <div className="flex justify-center items-center h-[85vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-12 bg-heritage-900/50 rounded-3xl shadow-2xl border border-heritage-900 w-full max-w-6xl h-[75vh] overflow-hidden"
      >
        {/* LEFT PANEL */}
        <div className="md:col-span-5 bg-heritage-900 p-12 flex flex-col justify-center items-center text-center border-r border-heritage-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
            <motion.div animate={{ y: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-1/4 w-1 h-[200%] bg-linear-to-b from-transparent via-orange-500 to-transparent" />
            <motion.div animate={{ y: ["-100%", "100%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }} className="absolute left-1/2 w-0.5 h-[200%] bg-linear-to-b from-transparent via-slate-400 to-transparent" />
            <motion.div animate={{ y: ["-100%", "100%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }} className="absolute left-3/4 w-1 h-[200%] bg-linear-to-b from-transparent via-orange-600 to-transparent" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 border-4 border-orange-500/40 rounded-full flex justify-center items-center mb-8">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-t-4 border-b-4 border-orange-500 rounded-full" />
            </div>
            <h1 className="text-5xl font-brand tracking-wide mb-4 text-transparent bg-clip-text bg-gradient-orange-text">UNLOCK JOURNEY</h1>
            <p className="text-lg font-tech text-slate-300 leading-relaxed max-w-sm mx-auto">Access your station. Manage reservations. Track schedules.</p>
          </div>
        </div>

        {/* RIGHT PANEL (FORM) */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:col-span-7 bg-heritage-950 p-12 lg:p-20 flex flex-col justify-center font-tech text-lg">
          <motion.h2 variants={itemVariants} className="text-4xl font-brand tracking-wide mb-6 text-slate-100 uppercase">
            ACCESS <span className="text-orange-500">STATION</span>
          </motion.h2>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-900 text-red-400 font-semibold tracking-wide text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-8">
            <motion.div variants={itemVariants}>
              <label className="block text-slate-300 font-semibold tracking-wide mb-3">EMAIL ADDRESS</label>
              <div className="relative">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors duration-300 peer" placeholder="Enter your email" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-slate-300 font-semibold tracking-wide mb-3">PASSWORD</label>
              <div className="relative">
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors duration-300 peer" placeholder="••••••••" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-4 rounded-xl bg-orange-600 text-slate-100 font-brand text-2xl tracking-widest shadow-lg shadow-orange-950/40 hover:shadow-orange-950/70 transition-shadow duration-300">
                LOGIN
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-10 border-t border-heritage-900 pt-8 text-center text-slate-300">
            Don't have an account? <Link to="/register" className="text-orange-500 hover:text-orange-400 transition-colors font-bold tracking-wide">CREATE ONE NOW</Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;