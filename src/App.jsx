import { Outlet } from "react-router-dom";
import './App.css';
import MainHeader from "./components/layout/header/MainHeader";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div>
      <MainHeader />
      {/* Sidebar nếu có, thêm ở đây */}
      <Outlet />
      
    </div>
  );
}

export default App;
