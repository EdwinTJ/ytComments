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
import Pagination from "@/components/Pagination";

interface Video {
  thumbnail: string;
  title: string;
  description: string;
  videoId: string;
}

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const videosPerPage = 10;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/channel_videos/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel_id: "UCSUwTmHIP_rlCTZeQW2oiEg",
          }),
        });

        const data = await response.json();
        setVideos(data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  const totalPages = Math.ceil(videos.length / videosPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="flex-1 p-8 overflow-auto">
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
              <Button className="bg-blue-500 text-white hover:bg-blue-600 flex-1">
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
