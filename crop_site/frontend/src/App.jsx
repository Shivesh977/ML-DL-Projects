import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginSignup from './components/LoginSignup';
import LeafPredictor from './components/LeafPredictor';
import CropRecommender from './components/CropRecommender';
import HistoryDashboard from './components/HistoryDashboard';
import FarmerGuide from './components/FarmerGuide';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('predict');

  useEffect(() => {
    if (token) {
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch (e) {
          setUser({ username: 'Farmer' });
        }
      } else {
        setUser({ username: 'Farmer' });
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const handleLoginSuccess = (data) => {
    setToken(data.token);
    setUser({
      username: data.username,
      email: data.email,
      phone: data.phone
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {token ? (
        <>
          {/* Main Navigation Header */}
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            user={user} 
            onLogout={handleLogout} 
          />
          
          <main className="flex-grow py-6">
            {activeTab === 'predict' && <LeafPredictor />}
            {activeTab === 'recommender' && <CropRecommender />}
            {activeTab === 'dashboard' && <HistoryDashboard />}
            {activeTab === 'guide' && <FarmerGuide />}
          </main>
          
          {/* Glassmorphic Presentation Footer */}
          <footer className="py-6 border-t border-white/5 bg-dark-900/40 text-center text-xs text-slate-500 font-semibold tracking-wider uppercase mt-12">
            © {new Date().getFullYear()} AgroVision AI Systems • Academic Minor Project Submission
          </footer>
        </>
      ) : (
        /* Sign-In Dashboard if token is absent */
        <LoginSignup onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
