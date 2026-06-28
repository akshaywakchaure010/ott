import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import IntroLoader, { hasSeenIntro } from "./components/intro/IntroLoader";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Movies from "./pages/Movies";
import Shows from "./pages/Shows";
import Sports from "./pages/Sports";
import Creator from "./pages/Creator";
import Categories from "./pages/Categories";
import MySpace from "./pages/MySpace";
import EditProfile from "./pages/EditProfile";
import TitleDetail from "./pages/TitleDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLayout from "./pages/admin/AdminLayout";
import Overview from "./pages/admin/Overview";
import ContentManager from "./pages/admin/ContentManager";
import UserManager from "./pages/admin/UserManager";

function App() {
  // Read once, synchronously, on first render — avoids a flash of the
  // intro for returning visitors and avoids a flash of the app for
  // brand-new visitors.
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro());

  if (showIntro) {
    return <IntroLoader onFinish={() => setShowIntro(false)} />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / viewer routes */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/creator" element={<Creator />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/title/:id" element={<TitleDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/myspace"
            element={
              <ProtectedRoute>
                <MySpace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myspace/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="users" element={<UserManager />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
