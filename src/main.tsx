
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set Delhi as the default center location for the app
window.defaultMapCenter = {
  latitude: 28.6139,
  longitude: 77.2090,
  zoom: 12
};

createRoot(document.getElementById("root")!).render(<App />);
