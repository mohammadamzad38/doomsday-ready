import { Navigate, Route, Routes } from "react-router-dom";
import MoviesPage from "./pages/moviePage";
import RewatchPlanPage from "./pages/rewatchPlanPage";
import BookingPage from "./pages/bookingPage";
import MainLayout from "./layout/layout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/movies" replace />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/rewatch" element={<RewatchPlanPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
