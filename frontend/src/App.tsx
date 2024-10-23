import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const channel_id = params.get("channel_id");
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (name && email && channel_id && access_token && refresh_token) {
      login(name, email, channel_id, access_token, refresh_token);
      navigate("/home", { replace: true });
    }
  }, [navigate, login]);

  return (
    <div className="flex">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
