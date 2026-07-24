import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchResults from './pages/SearchResults';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import TrainStatus from './pages/TrainStatus';
import StationBoard from './pages/StationBoard';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import PnrEnquiry from './pages/PnrEnquiry';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-heritage-950 text-slate-100 font-sans">
          <Navbar />

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} /> 
              <Route path="/results" element={<SearchResults />} /> 
              <Route path="/book" element={<Booking />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/train-status" element={<TrainStatus />} /> 
              <Route path="/station-board" element={<StationBoard />} />
              
              {/* The Final Utility Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/pnr" element={<PnrEnquiry />} />

              {/* Admin-only route — a single dashboard with tabs for Trains / Stations */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;