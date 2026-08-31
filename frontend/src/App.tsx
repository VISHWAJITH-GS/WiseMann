import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PurchaseAdvisor from './pages/PurchaseAdvisor';
import Inventory from './pages/Inventory';
import Forecast from './pages/Forecast';
import Suppliers from './pages/Suppliers';
import WhatIf from './pages/WhatIf';
import AIManager from './pages/AIManager';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/purchase-advisor" element={<PurchaseAdvisor />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/what-if" element={<WhatIf />} />
        <Route path="/ai-manager" element={<AIManager />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;
