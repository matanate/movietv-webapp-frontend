import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import AddTitlePage from "./pages/AddTitlePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TitlesPage from "./pages/TitlesPage";
import TitlePage from "./pages/TitlePage";
import SelectTitlePage from "./pages/SelectTitlePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectRoute from "./utils/ProtectRoute";
import ProtectRouteStaff from "./utils/ProtectRouteStaff";
import AppProvider from "./context/AppContext";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={<ProtectRoute>{<LoginPage />}</ProtectRoute>}
            />
            <Route
              path="/signup"
              element={<ProtectRoute>{<SignUpPage />}</ProtectRoute>}
            />
            <Route path="movies/" element={<TitlesPage category={"movie"} />} />
            <Route
              path="movies/:title_id"
              element={<TitlePage category={"movie"} />}
            />
            <Route path="tv-shows/" element={<TitlesPage category={"tv"} />} />
            <Route
              path="tv-shows/:title_id"
              element={<TitlePage category={"tv"} />}
            />
            <Route path="search/:searchTerm" element={<TitlesPage />} />
            <Route
              path="add-title"
              element={
                <ProtectRouteStaff>{<AddTitlePage />}</ProtectRouteStaff>
              }
            />
            <Route
              path="select-title"
              element={
                <ProtectRouteStaff>{<SelectTitlePage />}</ProtectRouteStaff>
              }
            />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
