import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

// Define the types for your state
interface Video {
  videoId: string;
  thumbnail: string;
  title: string;
  description?: string;
}

const Dashboard = () => {
  const { userData, api } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    } else {
      fetchUserVideos();
    }
  }, [userData, navigate]);

  const fetchUserVideos = async () => {
    try {
      const response = await api.get("/api/videos");
      const fetchedVideos = response.data.videos;
      setVideos(fetchedVideos);
      setError(
        fetchedVideos.length === 0 ? "No videos found for this channel." : null
      );
    } catch (error) {
      console.error("Error fetching videos:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
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
