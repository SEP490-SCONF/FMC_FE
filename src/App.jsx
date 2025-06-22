import { Outlet } from "react-router-dom";
import './App.css';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div>
      <Header />
      {/* Sidebar nếu có, thêm ở đây */}
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
