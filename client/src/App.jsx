import { Routes, Route } from "react-router-dom";
import Index from "./components/notes/Index";
import Create from "./components/notes/Create";
import Edit from "./components/notes/Edit";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Seller from './pages/Seller'
import Admin from './pages/Admin'
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
      {/* Notes */}
      <Route path="/" element={<Index />} />
      <Route path="/create" element={<Create />} />
      <Route path="/edit/:id" element={<Edit />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/seller" element={<Seller />} />
        <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
