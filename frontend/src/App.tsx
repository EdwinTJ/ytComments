import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="relative flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1">
        <aside className="w-50 bg-white shadow-md md:w-50">
          <Navbar />
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
