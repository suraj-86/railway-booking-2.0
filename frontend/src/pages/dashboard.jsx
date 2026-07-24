import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchType, setSearchType] = useState('route'); 
  const navigate = useNavigate();

  // --- 1. ROUTE SEARCH STATE ---
  const [fromQuery, setFromQuery] = useState('');
  const [fromCode, setFromCode] = useState(''); // the actual station code we'll search with
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]); 

  const [toQuery, setToQuery] = useState('');
  const [toCode, setToCode] = useState('');
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [toSuggestions, setToSuggestions] = useState([]); 

  const [journeyDate, setJourneyDate] = useState('');

  // --- 2. TRAIN SEARCH STATE ---
  const [trainQuery, setTrainQuery] = useState('');
  const [trainNumberSelected, setTrainNumberSelected] = useState('');
  const [showTrainDropdown, setShowTrainDropdown] = useState(false);
  const [trainSuggestions, setTrainSuggestions] = useState([]);

  // --- 3. STATION SEARCH STATE ---
  const [stationQuery, setStationQuery] = useState('');
  const [stationCodeSelected, setStationCodeSelected] = useState('');
  const [showStationDropdown, setShowStationDropdown] = useState(false);
  const [stationSuggestions, setStationSuggestions] = useState([]);

  // --- REAL BACKEND API HANDLERS ---
  // type is 'stations' or 'trains' — both endpoints accept a `q` query param
  const searchAPI = async (type, query, setSuggestions) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/${type}?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (response.ok) {
        setSuggestions(type === 'stations' ? data.stations : data.trains);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("API error:", error);
      setSuggestions([]);
    }
  };

  const handleRouteSearch = () => {
    const source = fromCode || fromQuery;
    const destination = toCode || toQuery;

    if (!source || !destination) return; // nothing to search yet

    const params = new URLSearchParams({ source, destination });
    if (journeyDate) params.set('date', journeyDate);
    navigate(`/results?${params.toString()}`);
  };

  const handleTrainLocate = () => {
    const number = trainNumberSelected || trainQuery;
    if (!number) return;
    navigate(`/train-status?number=${encodeURIComponent(number)}`);
  };

  const handleStationView = () => {
    const code = stationCodeSelected || stationQuery;
    if (!code) return;
    navigate(`/station-board?code=${encodeURIComponent(code)}`);
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-12 bg-heritage-900/50 rounded-3xl shadow-2xl border border-heritage-900 w-full max-w-7xl overflow-hidden"
      >
        {/* LEFT PANEL: SEARCH HUB */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:col-span-8 bg-heritage-950 p-10 flex flex-col font-tech">
          
          {/* Search Tabs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 border-b border-heritage-900 pb-4 mb-8">
            <button onClick={() => setSearchType('route')} className={`text-sm md:text-lg font-brand tracking-wide px-4 py-2 rounded-lg transition-colors ${searchType === 'route' ? 'bg-orange-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}>ROUTE SEARCH</button>
            <button onClick={() => setSearchType('train')} className={`text-sm md:text-lg font-brand tracking-wide px-4 py-2 rounded-lg transition-colors ${searchType === 'train' ? 'bg-orange-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}>TRAIN SEARCH</button>
            <button onClick={() => setSearchType('station')} className={`text-sm md:text-lg font-brand tracking-wide px-4 py-2 rounded-lg transition-colors ${searchType === 'station' ? 'bg-orange-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}>STATION SEARCH</button>
          </motion.div>

          {/* Dynamic Search Forms */}
          <motion.div variants={itemVariants} className="flex-grow">
            
            {/* ROUTE SEARCH TAB */}
            {searchType === 'route' && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  
                  {/* FROM STATION */}
                  <div className="relative">
                    <label className="block text-slate-300 font-semibold tracking-wide mb-2">FROM STATION</label>
                    <input 
                      type="text" 
                      value={fromQuery}
                      onChange={(e) => {
                        setFromQuery(e.target.value);
                        setFromCode('');
                        setShowFromDropdown(true);
                        searchAPI('stations', e.target.value, setFromSuggestions);
                      }}
                      onFocus={() => setShowFromDropdown(true)}
                      onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)} 
                      className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                      placeholder="e.g., New Delhi (NDLS)" 
                      autoComplete="off"
                    />
                    <AnimatePresence>
                      {showFromDropdown && fromQuery && (
                        <motion.ul initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-20 w-full mt-2 bg-heritage-950 border border-heritage-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                          {fromSuggestions.length > 0 ? (
                            fromSuggestions.map((st) => (
                              <li key={st.id} onClick={() => { setFromQuery(`${st.name} (${st.code})`); setFromCode(st.code); setShowFromDropdown(false); }} className="px-5 py-3 hover:bg-heritage-900 cursor-pointer text-slate-200 border-b border-heritage-900/50">{st.name} ({st.code})</li>
                            ))
                          ) : (
                            <li className="px-5 py-3 text-slate-500 italic">No stations found</li>
                          )}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* TO STATION */}
                  <div className="relative">
                    <label className="block text-slate-300 font-semibold tracking-wide mb-2">TO STATION</label>
                    <input 
                      type="text" 
                      value={toQuery}
                      onChange={(e) => {
                        setToQuery(e.target.value);
                        setToCode('');
                        setShowToDropdown(true);
                        searchAPI('stations', e.target.value, setToSuggestions);
                      }}
                      onFocus={() => setShowToDropdown(true)}
                      onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                      className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                      placeholder="e.g., Mumbai Central (BCT)" 
                      autoComplete="off"
                    />
                    <AnimatePresence>
                      {showToDropdown && toQuery && (
                        <motion.ul initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-20 w-full mt-2 bg-heritage-950 border border-heritage-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                          {toSuggestions.length > 0 ? (
                            toSuggestions.map((st) => (
                              <li key={st.id} onClick={() => { setToQuery(`${st.name} (${st.code})`); setToCode(st.code); setShowToDropdown(false); }} className="px-5 py-3 hover:bg-heritage-900 cursor-pointer text-slate-200 border-b border-heritage-900/50">{st.name} ({st.code})</li>
                            ))
                          ) : (
                            <li className="px-5 py-3 text-slate-500 italic">No stations found</li>
                          )}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

                <div>
                  <label className="block text-slate-300 font-semibold tracking-wide mb-2">JOURNEY DATE</label>
                  <input type="date" value={journeyDate} onChange={(e) => setJourneyDate(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                
                <motion.button type="button" onClick={handleRouteSearch} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl bg-orange-600 text-slate-100 font-brand text-2xl tracking-widest shadow-lg shadow-orange-950/40 hover:shadow-orange-950/70 transition-shadow duration-300 mt-4">
                  SEARCH TRAINS
                </motion.button>
              </form>
            )}

            {/* TRAIN SEARCH TAB */}
            {searchType === 'train' && (
              <form className="space-y-6">
                <div className="relative">
                  <label className="block text-slate-300 font-semibold tracking-wide mb-2">TRAIN NAME OR NUMBER</label>
                  <input 
                    type="text" 
                    value={trainQuery}
                    onChange={(e) => {
                      setTrainQuery(e.target.value);
                      setTrainNumberSelected('');
                      setShowTrainDropdown(true);
                      searchAPI('trains', e.target.value, setTrainSuggestions);
                    }}
                    onFocus={() => setShowTrainDropdown(true)}
                    onBlur={() => setTimeout(() => setShowTrainDropdown(false), 200)}
                    className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                    placeholder="e.g., 12951 or Rajdhani Express" 
                    autoComplete="off"
                  />
                  <AnimatePresence>
                    {showTrainDropdown && trainQuery && (
                      <motion.ul initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-20 w-full mt-2 bg-heritage-950 border border-heritage-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {trainSuggestions.length > 0 ? (
                          trainSuggestions.map((tr) => (
                            <li key={tr.id} onClick={() => { setTrainQuery(`${tr.name} (${tr.trainNumber})`); setTrainNumberSelected(tr.trainNumber); setShowTrainDropdown(false); }} className="px-5 py-3 hover:bg-heritage-900 cursor-pointer text-slate-200 border-b border-heritage-900/50">{tr.name} ({tr.trainNumber})</li>
                          ))
                        ) : (
                          <li className="px-5 py-3 text-slate-500 italic">No trains found</li>
                        )}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button type="button" onClick={handleTrainLocate} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl bg-orange-600 text-slate-100 font-brand text-2xl tracking-widest shadow-lg shadow-orange-950/40 hover:shadow-orange-950/70 transition-shadow mt-4">
                  LOCATE TRAIN
                </motion.button>
              </form>
            )}

            {/* STATION SEARCH TAB */}
            {searchType === 'station' && (
              <form className="space-y-6">
                <div className="relative">
                  <label className="block text-slate-300 font-semibold tracking-wide mb-2">STATION CODE / NAME</label>
                  <input 
                    type="text" 
                    value={stationQuery}
                    onChange={(e) => {
                      setStationQuery(e.target.value);
                      setStationCodeSelected('');
                      setShowStationDropdown(true);
                      searchAPI('stations', e.target.value, setStationSuggestions);
                    }}
                    onFocus={() => setShowStationDropdown(true)}
                    onBlur={() => setTimeout(() => setShowStationDropdown(false), 200)}
                    className="w-full px-5 py-4 rounded-xl bg-heritage-900 border border-heritage-900 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                    placeholder="e.g., NDLS" 
                    autoComplete="off"
                  />
                  <AnimatePresence>
                    {showStationDropdown && stationQuery && (
                      <motion.ul initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-20 w-full mt-2 bg-heritage-950 border border-heritage-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {stationSuggestions.length > 0 ? (
                          stationSuggestions.map((st) => (
                            <li key={st.id} onClick={() => { setStationQuery(`${st.name} (${st.code})`); setStationCodeSelected(st.code); setShowStationDropdown(false); }} className="px-5 py-3 hover:bg-heritage-900 cursor-pointer text-slate-200 border-b border-heritage-900/50">{st.name} ({st.code})</li>
                          ))
                        ) : (
                          <li className="px-5 py-3 text-slate-500 italic">No stations found</li>
                        )}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button type="button" onClick={handleStationView} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl bg-orange-600 text-slate-100 font-brand text-2xl tracking-widest shadow-lg shadow-orange-950/40 hover:shadow-orange-950/70 transition-shadow mt-4">
                  VIEW STATION BOARD
                </motion.button>
              </form>
            )}

          </motion.div>

          {/* Search History */}
          <motion.div variants={itemVariants} className="mt-12 border-t border-heritage-900 pt-6">
            <h3 className="text-slate-400 font-brand tracking-wider mb-4 text-sm">RECENT SEARCHES</h3>
            <div className="flex space-x-4">
              <div className="bg-heritage-900/50 px-4 py-2 rounded-lg border border-heritage-900 text-sm text-slate-300 cursor-pointer hover:border-orange-500 transition-colors">
                NDLS → BCT
              </div>
              <div className="bg-heritage-900/50 px-4 py-2 rounded-lg border border-heritage-900 text-sm text-slate-300 cursor-pointer hover:border-orange-500 transition-colors">
                Train 12951
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL: USER HUB */}
        <div className="md:col-span-4 bg-heritage-900 p-10 flex flex-col border-l border-heritage-900">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-brand text-slate-100 tracking-wide uppercase">
              WELCOME, <br/><span className="text-orange-500">{user?.name || 'PASSENGER'}</span>
            </h2>
            <p className="text-slate-400 font-tech mt-2">Ready for your next departure?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow content-start font-tech">
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSearchType('route')} className="bg-heritage-950 p-6 rounded-xl border border-heritage-800 hover:border-orange-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-3xl mb-2">🎫</span>
              <span className="text-slate-200 font-bold tracking-wide text-sm">BOOK TICKET</span>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/bookings')} className="bg-heritage-950 p-6 rounded-xl border border-heritage-800 hover:border-orange-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-3xl mb-2">📋</span>
              <span className="text-slate-200 font-bold tracking-wide text-sm">MY BOOKINGS</span>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/pnr')} className="bg-heritage-950 p-6 rounded-xl border border-heritage-800 hover:border-orange-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-3xl mb-2">🔍</span>
              <span className="text-slate-200 font-bold tracking-wide text-sm">PNR ENQUIRY</span>
            </motion.div>
            
            {/* UPDATED: MY PROFILE BUTTON */}
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/profile')} className="bg-heritage-950 p-6 rounded-xl border border-heritage-800 hover:border-orange-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-3xl mb-2">🪪</span>
              <span className="text-slate-200 font-bold tracking-wide text-sm">MY PROFILE</span>
            </motion.div>

            {/* ADMIN CONTROL — only visible to admins */}
            {user?.role === 'ADMIN' && (
              <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/admin')} className="bg-heritage-950 p-6 rounded-xl border border-orange-900 hover:border-orange-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center shadow-lg">
                <span className="text-3xl mb-2">🛠️</span>
                <span className="text-orange-500 font-bold tracking-wide text-sm">ADMIN CONTROL</span>
              </motion.div>
            )}
          </div>
        </div>
        
      </motion.div>
    </div>
  );
};

export default Dashboard;