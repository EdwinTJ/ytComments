import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "../api";

const Account = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("userData");
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!userData) {
    return null; // or a loading spinner
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Account Information</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Name: {userData.name}</h2>
        <p>Email: {userData.email}</p>
        <p>Channel ID: {userData.channel_id}</p>
      </div>
      <Button onClick={handleLogout} className="bg-red-500 text-white mr-4">
        Logout
      </Button>
      <Button onClick={() => navigate("/")} className="bg-blue-500 text-white">
        Back to Dashboard
      </Button>
    </div>
  );
};

export default Account;
