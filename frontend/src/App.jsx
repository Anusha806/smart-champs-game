import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Leaderboard from "./pages/Leaderboard";
import Level1 from "./pages/Level1";
import Level2 from "./pages/Level2";
import Level3 from "./pages/Level3";
import Level4 from "./pages/Level4";
import Level5 from "./pages/Level5";
import Level6 from "./pages/Level6";
import Level7 from "./pages/Level7";
import Level8 from "./pages/Level8";
import Result from "./pages/Result";
import ProtectedRoute
from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
            path="/level1"
            element={
                <ProtectedRoute level={1}>
                    <Level1 />
                </ProtectedRoute>
            }
        />
        <Route
            path="/level2"
            element={
                <ProtectedRoute level={2}>
                    <Level2 />
                </ProtectedRoute>
            }
        />
        <Route
            path="/level3"
            element={
                <ProtectedRoute level={3}>
                    <Level3 />
                </ProtectedRoute>
            }
        />
        <Route
            path="/level4"
            element={
                <ProtectedRoute level={4}>
                    <Level4 />
                </ProtectedRoute>
            }
        />
        <Route
              path="/level5"
              element={
                  <ProtectedRoute level={5}>
                      <Level5 />
                  </ProtectedRoute>
              }
          />
        <Route
            path="/level6"
            element={
                <ProtectedRoute level={6}>
                    <Level6 />
                </ProtectedRoute>
            }
        />
        <Route
            path="/level7"
            element={
                <ProtectedRoute level={7}>
                    <Level7 />
                </ProtectedRoute>
            }
        />
        <Route
            path="/level8"
            element={
                <ProtectedRoute level={8}>
                    <Level8 />
                </ProtectedRoute>
            }
        />
        <Route path="/result" element={<Result />} />
        <Route
            path="/leaderboard"
            element={<Leaderboard />}
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;