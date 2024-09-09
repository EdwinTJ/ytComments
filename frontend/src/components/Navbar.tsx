import { Link } from "react-router-dom";
import { HomeIcon, UserIcon, SettingsIcon } from "lucide-react";
export default function Navbar() {
  return (
    <>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-100"
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/videos"
              className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-100"
            >
              <UserIcon className="w-5 h-5 mr-3" />
              Account
            </Link>
          </li>
          <li>
            <Link
              to="/hre"
              className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-100"
            >
              <SettingsIcon className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
