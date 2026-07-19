import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <-- 1. Import Provider
import Navbar from './components/Navbar';
import Login from './pages/Login'; 
import Register from './pages/Register'; 

function App() {
  return (
    // 2. Wrap everything in the AuthProvider
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-heritage-950 text-slate-100 font-sans">
          <Navbar />

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="text-center mt-20">
                  <h1 className="text-6xl font-brand tracking-widest text-transparent bg-clip-text bg-gradient-orange-text mb-6">
                    WELCOME TO RAILWAY 2.0
                  </h1>
                  <p className="text-xl font-tech text-slate-300">Your journey begins here.</p>
                </div>
              } />
              
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;