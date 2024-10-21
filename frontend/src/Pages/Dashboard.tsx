import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVideos } from "../api";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";

// Define the types for your state
interface UserData {
  name: string;
  email: string;
  channel_id: string;
}

interface Video {
  videoId: string;
  thumbnail: string;
  title: string;
  description?: string;
}
interface AxiosError {
  response?: {
    status: number;
  };
}
const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const token = localStorage.getItem("accessToken");
    if (storedUserData && token) {
      setUserData(JSON.parse(storedUserData));
      fetchUserVideos();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserVideos = async () => {
    try {
      const fetchedVideos = await fetchVideos();
      setVideos(fetchedVideos);
      if (fetchedVideos.length === 0) {
        setError("No videos found for this channel.");
      } else {
        setError(null); // Clear error if videos are found
      }
    } catch (err: unknown) {
      // Use a more specific type
      const error = err as AxiosError; // Type assertion

      console.error("Error fetching videos:", error);
      if (error.response && error.response.status === 401) {
        setError("Authentication failed. Please log in again.");
        navigate("/login");
      } else {
        setError(
          `Failed to fetch videos. Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your YouTube Videos</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      ) : (
        <p>No videos found. Try uploading some videos to your channel!</p>
      )}
      <Button
        onClick={() => navigate("/account")}
        className="mt-8 bg-blue-500 text-white"
      >
        View Account
      </Button>
    </div>
  );
};

export default Dashboard;
