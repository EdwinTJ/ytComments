import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { PlusIcon, TrashIcon } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id: string;
}
interface Channel {
  id: string;
  channel_id: string;
}
interface User {
  name: string;
  email: string;
  channels: string[];
}

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null); // Error state
  const [newChannelId, setNewChannelId] = useState<string>(""); // State for new channel ID
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // Dialog state

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
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
          setIsLoading(false);
        }
      } else {
        console.error("No token found");
        setIsLoading(false);
      }
    };

    const fetchUserChannels = async () => {
      if (token) {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        const userId = decoded.user_id;

        try {
          const response = await fetch(
            `http://127.0.0.1:8000/users/${userId}/channels/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const responseBody = await response.text(); // Read as text first
          if (response.status === 404) {
            setError("No channels found for this user.");
            setChannels([]); // Clear channels
            return;
          }

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = JSON.parse(responseBody);
          setChannels(data); // Set channels data
        } catch (error) {
          console.error("Failed to fetch channels:", error);
          setError("Failed to fetch channels.");
        }
      } else {
        console.error("No token found");
      }
    };

    fetchUserData();
    fetchUserChannels();
  }, []);

  // Function to handle adding a channel
  const addChannel = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    const userId = decoded.user_id;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/users/${userId}/channels/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ channel_id: newChannelId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const newChannel = await response.json();
      setChannels([...channels, newChannel]); // Update the channel list
      setNewChannelId(""); // Reset the input field
      setIsDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to add channel:", error);
    }
  };

  const deleteChannel = (id: string) => {
    console.log(`delete ${id}`);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>No user data available.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
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
              <p className="mt-1 text-lg text-gray-900">{user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Channels Section */}
        <section className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Channels</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Channel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={addChannel} className="space-y-4">
                  <div>
                    <Label htmlFor="userId">User ID</Label>
                    <Input id="userId" value={user.email} disabled />
                  </div>
                  <div>
                    <Label htmlFor="channelId">Channel ID</Label>
                    <Input
                      id="channelId"
                      value={newChannelId}
                      onChange={(e) => setNewChannelId(e.target.value)}
                      placeholder="Enter Channel ID"
                      required
                    />
                  </div>
                  <Button type="submit">Add Channel</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {error ? (
            <p className="text-red-500">{error}</p> // Display error message
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel ID</TableHead>
                  <TableHead className="w-[100px]">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2}>No channels available.</TableCell>
                  </TableRow>
                ) : (
                  channels.map((channel) => (
                    <TableRow key={channel.id} className="hover:bg-gray-100">
                      <TableCell>{channel.channel_id}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => deleteChannel(channel.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Delete channel</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </section>
      </div>
    </div>
  );
}
