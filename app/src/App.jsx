import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AssetDashboard from "./pages/AssetDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AssetDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
