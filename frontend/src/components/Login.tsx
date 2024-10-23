// src/components/Login.tsx
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to YouTube Summary AI</h1>
      <Button onClick={loginWithGoogle} className="bg-red-600 text-white">
        Login with Google
      </Button>
    </div>
  );
}
