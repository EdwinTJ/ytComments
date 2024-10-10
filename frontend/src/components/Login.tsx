import { Button } from "@/components/ui/button";
import { loginWithGoogle } from "../api";

export default function Login() {
  const handleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to YouTube Summary AI</h1>
      <Button onClick={handleLogin} className="bg-red-600 text-white">
        Login with Google
      </Button>
    </div>
  );
}
