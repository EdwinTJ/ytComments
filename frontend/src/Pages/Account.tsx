import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";

const Account = () => {
  const { userData, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      setError("Error logging out");
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Account Information
          </h1>
        </header>

        {/* Personal Details Section */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Personal Details
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-lg text-gray-900">{userData.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-lg text-gray-900">{userData.email}</p>
            </div>
          </div>
        </section>

        {/* Channel Section */}
        <section className="bg-white shadow rounded-lg p-6">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  key={userData.channel_id}
                  className="hover:bg-gray-100"
                >
                  <TableCell>{userData.channel_id}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </section>

        {/* Logout Button */}
        <Button
          onClick={() => handleLogout()}
          className="mt-8 bg-blue-500 text-white"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Account;
