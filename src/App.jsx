import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';
import Dashboard from './components/Dashboard.jsx';
import MedicationsPage from './components/MedicationsPage.jsx';
import CalendarPage from './components/CalendarPage.jsx';
import Logger from './components/Logger.jsx';
import { HealthProvider } from './context/HealthContext.jsx';

export default function App() {
  return (
    <HealthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/logger" element={<Logger />} />
        </Routes>
      </Router>
    </HealthProvider>
  );
}
