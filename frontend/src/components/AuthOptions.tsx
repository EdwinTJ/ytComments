import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogInIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";

export default function AuthOptions() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        navigate("/account"); // Redirect to the dashboard
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (error) {
      setError("Login failed");
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-900">
            Welcome
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-gray-600">
            Enter your credentials to log in
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-8 space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <Button
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              onClick={handleLogin}
            >
              <LogInIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              Login
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md"
              onClick={() => console.log("Sign Up clicked")}
            >
              <UserPlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
