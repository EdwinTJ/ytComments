import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  VideoIcon,
  LogOutIcon,
  Youtube,
} from "lucide-react";
import { logout } from "../api";
export default function Navbar() {
  const isAuthenticated = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/");
    }
  };
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="p-4">
      <ul className="space-y-2">
        {isAuthenticated && (
          <>
            <li>
              <Link
                to="/home"
                className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-100"
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-100"
              >
                <UserIcon className="w-5 h-5 mr-3" />
                Account
              </Link>
            </li>
            <li>
              <Link
                to="/videos"
                className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-100"
              >
                <Youtube className="w-5 h-5 mr-3" />
                Videos
              </Link>
            </li>
            <li>
              <Link
                to="/videoById"
                className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-100"
              >
                <VideoIcon className="w-5 h-5 mr-3" />
                Video ID
              </Link>
            </li>
            <li>
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-100 w-full"
              >
                <LogOutIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
