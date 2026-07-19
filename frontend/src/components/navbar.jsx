import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-heritage-950/80 backdrop-blur-sm border-b border-heritage-900 shadow-xl sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Modern Clean Logo */}
        <Link to="/" className="text-3xl font-brand tracking-tight text-transparent bg-clip-text bg-gradient-orange-text uppercase">
          RAILWAY 2.0
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center font-tech text-xl">
          {user ? (
            <>
              <span className="text-slate-300 font-semibold tracking-wide">
                WELCOME, <span className="text-orange-500">{user.name.toUpperCase()}</span>
              </span>
              <motion.button 
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg border-2 border-heritage-900 text-slate-300 font-bold tracking-wider hover:bg-heritage-900 transition-colors duration-300"
              >
                LOGOUT
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-slate-100 transition-colors duration-300 font-semibold tracking-wide">
                LOGIN
              </Link>
              
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg bg-orange-600 text-slate-100 font-bold tracking-wider shadow-lg shadow-orange-950/50 hover:shadow-orange-950/80 transition-shadow duration-300"
                >
                  SIGN UP
                </motion.button>
              </Link>
            </>
          )}
        </div>

      </div>
    </motion.nav>
  );
};

export default Navbar;