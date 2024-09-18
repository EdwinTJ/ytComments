import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id: string;
}

interface User {
  name: string;
  email: string;
  channels: string[];
}

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        const userId = decoded.user_id;

        try {
          const response = await fetch(
            `http://127.0.0.1:8000/users/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          setUser(data); // Set user data
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      } else {
        console.error("No token found");
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>No user data available.</p>;
  }

  return (
    <section className="flex-1 p-8 overflow-auto">
      <Card className="w-full max-w-md mx-auto overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold text-gray-800">
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col p-4">
          <CardDescription className="text-lg text-gray-600">
            <strong>Name:</strong> {user.name}
          </CardDescription>
          <CardDescription className="text-lg text-gray-600 mt-2">
            <strong>Email:</strong> {user.email}
          </CardDescription>
          <CardDescription className="text-lg text-gray-600 mt-2">
            <strong>Associated YouTube Channels:</strong>
          </CardDescription>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            {/* Use optional chaining or provide a default empty array */}
            {user.channels?.length > 0 ? (
              user.channels.map((channel, index) => (
                <li key={index}>{channel}</li>
              ))
            ) : (
              <li>No channels associated.</li>
            )}
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between p-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 flex-1"
            onClick={() => {
              // Logic to handle editing account
              console.log("Edit Account clicked");
            }}
          >
            Edit Account
          </Button>
          <Button
            variant="outline"
            className="bg-white text-gray-600 border-gray-300 hover:bg-gray-100 flex-1"
            onClick={() => {
              // Logic to handle logout
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Log Out
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
