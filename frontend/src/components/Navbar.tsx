import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  VideoIcon,
  LogOutIcon,
  Youtube,
} from "lucide-react";

export default function Navbar() {
  const isAuthenticated = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="p-4 w-64 bg-gray-100 h-screen">
      <ul className="space-y-2">
        <li>
          <Link
            to="/home"
            className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200"
          >
            <HomeIcon className="w-5 h-5 mr-3" />
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/account"
            className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200"
          >
            <UserIcon className="w-5 h-5 mr-3" />
            Account
          </Link>
        </li>
        <li>
          <Link
            to="/videos"
            className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200"
          >
            <Youtube className="w-5 h-5 mr-3" />
            Videos
          </Link>
        </li>
        <li>
          <Link
            to="/videoById"
            className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200"
          >
            <VideoIcon className="w-5 h-5 mr-3" />
            Video ID
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200 w-full"
          >
            <LogOutIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
