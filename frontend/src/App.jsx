import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard';
import SearchResults from './pages/SearchResults';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation'; // <-- Import the final page

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
              <Route path="/confirmation" element={<Confirmation />} /> {/* <-- Add the route */}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;