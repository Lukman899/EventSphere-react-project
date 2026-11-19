import { Route, Routes, useLocation, useParams } from "react-router";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import { Toaster } from "sonner";
import EventDetailsPage from "./pages/EventDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection: selection:text-[#f30b0b]">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:slug" element={<EventDetailsPage />} 
          />
          <Route path="/favorites" element={<FavoritesPage/>} 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <Toaster
        richColors
        toastOptions={{
          style: {
            borderRadius: "1rem",
            border: "1px solid #EBE8DF",
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}

export default App;