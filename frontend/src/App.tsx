import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md">
        {" "}
        <Navbar />
      </aside>
      <Outlet />
    </div>
  );
}

export default App;
