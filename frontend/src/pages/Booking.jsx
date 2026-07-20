import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'M', preference: 'No Preference' }
  ]);

  const handleAddPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { name: '', age: '', gender: 'M', preference: 'No Preference' }]);
    }
  };

  const handleRemovePassenger = (index) => {
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    // In the future, this will trigger the payment gateway or backend API
    navigate('/confirmation'); 
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      
      {/* Journey Summary Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-heritage-900/40 border border-orange-500/50 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center"
      >
        <div>
          <h2 className="text-2xl font-brand text-slate-100 uppercase tracking-wide">
            RAJDHANI EXPRESS <span className="text-orange-500">| 12951</span>
          </h2>
          <p className="text-slate-400 font-tech mt-1">NEW DELHI → MUMBAI | Class: 3A | Quota: GENERAL</p>
        </div>
        <div className="mt-4 md:mt-0 text-right font-tech">
          <div className="text-3xl font-bold text-orange-500">₹{passengers.length * 2150}</div>
          <div className="text-sm text-slate-400">Base Fare ({passengers.length} Passenger{passengers.length > 1 ? 's' : ''})</div>
        </div>
      </motion.div>

      {/* Passenger Details Form */}
      <motion.form 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        onSubmit={handleCheckout} 
        className="space-y-6"
      >
        <div className="flex justify-between items-end border-b border-heritage-900 pb-4">
          <h3 className="text-xl font-brand text-slate-100 tracking-wider">PASSENGER DETAILS</h3>
          <span className="text-sm font-tech text-slate-400">Max 6 Passengers</span>
        </div>

        {passengers.map((p, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            key={index} 
            className="bg-heritage-950 border border-heritage-800 p-6 rounded-xl relative flex flex-col md:flex-row gap-4 font-tech"
          >
            {/* Remove Button */}
            {passengers.length > 1 && (
              <button 
                type="button" 
                onClick={() => handleRemovePassenger(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400 font-bold px-2"
              >
                ✕
              </button>
            )}

            <div className="flex-1">
              <label className="block text-slate-400 text-xs tracking-wider mb-2">FULL NAME</label>
              <input 
                required type="text" placeholder="Passenger Name"
                value={p.name} onChange={(e) => handleChange(index, 'name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500" 
              />
            </div>
            
            <div className="w-full md:w-24">
              <label className="block text-slate-400 text-xs tracking-wider mb-2">AGE</label>
              <input 
                required type="number" min="1" max="120" placeholder="Age"
                value={p.age} onChange={(e) => handleChange(index, 'age', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500" 
              />
            </div>

            <div className="w-full md:w-32">
              <label className="block text-slate-400 text-xs tracking-wider mb-2">GENDER</label>
              <select 
                value={p.gender} onChange={(e) => handleChange(index, 'gender', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 appearance-none"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>

            <div className="w-full md:w-48">
              <label className="block text-slate-400 text-xs tracking-wider mb-2">BERTH PREF.</label>
              <select 
                value={p.preference} onChange={(e) => handleChange(index, 'preference', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 appearance-none"
              >
                <option value="No Preference">No Preference</option>
                <option value="Lower">Lower</option>
                <option value="Middle">Middle</option>
                <option value="Upper">Upper</option>
                <option value="Side Lower">Side Lower</option>
                <option value="Side Upper">Side Upper</option>
              </select>
            </div>
          </motion.div>
        ))}

        {/* Add Passenger Button */}
        {passengers.length < 6 && (
          <button 
            type="button" 
            onClick={handleAddPassenger}
            className="text-orange-500 font-tech font-bold hover:text-orange-400 transition-colors flex items-center space-x-2"
          >
            <span>+ ADD NEW PASSENGER</span>
          </button>
        )}

        {/* Contact Information */}
        <div className="mt-8 pt-6 border-t border-heritage-900">
          <h3 className="text-xl font-brand text-slate-100 tracking-wider mb-4">CONTACT DETAILS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-tech">
            <div>
              <label className="block text-slate-400 text-xs tracking-wider mb-2">EMAIL ADDRESS (For Ticket)</label>
              <input required type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-heritage-950 border border-heritage-800 text-slate-100 focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs tracking-wider mb-2">MOBILE NUMBER (For SMS Alerts)</label>
              <input required type="tel" placeholder="10-digit mobile number" className="w-full px-4 py-3 rounded-lg bg-heritage-950 border border-heritage-800 text-slate-100 focus:outline-none focus:border-orange-500" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
          type="submit"
          className="w-full py-4 mt-8 rounded-xl bg-orange-600 text-slate-100 font-brand text-2xl tracking-widest shadow-lg shadow-orange-950/40 hover:shadow-orange-950/70 transition-shadow duration-300"
        >
          AUTHORIZE PAYMENT & BOOK
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Booking;