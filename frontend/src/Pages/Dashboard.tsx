import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jwtDecode } from "jwt-decode";

interface Video {
  thumbnail: string;
  title: string;
  description: string;
  videoId: string;
}

interface Channel {
  id: string;
  channel_id: string;
}

interface DecodedToken {
  user_id: string;
  exp: number;
}

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const videosPerPage = 10;
  const navigate = useNavigate();

  const isTokenExpired = (token: string) => {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  useEffect(() => {
    const fetchChannels = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        const userId = decoded.user_id;

        try {
          const response = await fetch(
            `http://127.0.0.1:8000/channels/${userId}/channels/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          if (response.ok) {
            setChannels(data);
            if (data.length > 0) {
              setSelectedChannel(data[0].channel_id);
            }
          } else {
            console.error("Failed to fetch channels:", data.detail);
          }
        } catch (error) {
          console.error("Error fetching channels:", error);
        }
      }
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    if (!selectedChannel) return;

    const fetchVideos = async () => {
      const token = localStorage.getItem("token");
      console.log("token ", token);
      if (!token) {
        console.error("Token is missing.");
        return;
      }

      if (isTokenExpired(token)) {
        console.error("Token is expired.");
        navigate("/");
        return;
      }
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/channels/channel_videos/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ channel_id: selectedChannel }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setVideos(data.videos || []);
        } else {
          console.error("Failed to fetch videos:", data.detail);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [selectedChannel]);

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  const totalPages = Math.ceil(videos.length / videosPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="flex-1 p-8 overflow-auto">
      <div className="flex justify-center mb-4">
        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a channel" />
          </SelectTrigger>
          <SelectContent>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={channel.channel_id}>
                {channel.channel_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentVideos.map((video, index) => (
          <Card
            key={index}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto overflow-hidden"
          >
            <CardHeader className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-32 sm:h-48 md:h-56 lg:h-64 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="flex flex-col p-4">
              <CardTitle className="text-lg text-wrap font-bold text-gray-800 mb-2 truncate">
                {video.title}
              </CardTitle>
              <CardDescription className="text-sm text-wrap text-gray-600 truncate">
                {video.description || "No description available."}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between p-4 space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                className="bg-white text-gray-600 border-gray-300 hover:bg-gray-100 flex-1"
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${video.videoId}`,
                    "_blank"
                  )
                }
              >
                Watch Video
              </Button>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600 flex-1"
                onClick={() =>
                  navigate(`/aisummary/${video.videoId}`, {
                    state: { title: video.title },
                  })
                }
              >
                Get AI Summary
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
