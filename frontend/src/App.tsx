import { Navigate, Route, Routes } from "react-router-dom";
import MoviesPage from "./pages/moviePage";
import RewatchPlanPage from "./pages/rewatchPlanPage";
import BookingPage from "./pages/bookingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/movies" replace />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/rewatch" element={<RewatchPlanPage />} />
      <Route path="/booking" element={<BookingPage />} />
    </Routes>
  );
}

export default App;
