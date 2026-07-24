import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Booking from './pages/Booking.jsx';
import Confirmation from './pages/Confirmation.jsx';
import TrainStatus from './pages/TrainStatus.jsx';
import StationBoard from './pages/StationBoard.jsx';
import Profile from './pages/Profile.jsx';
import MyBookings from './pages/MyBookings.jsx';
import PnrEnquiry from './pages/PnrEnquiry.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';

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