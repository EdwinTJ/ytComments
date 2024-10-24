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

// Define the Video type
interface VideoCardProps {
  video: {
    videoId: string;
    thumbnail: string;
    title: string;
    description?: string;
  };
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();
  const handleAISummaryClick = () => {
    navigate(`/aisummary/${video.videoId}`, {
      state: { title: video.title },
    });
  };
  return (
    <section>
      <Card
        key={video.videoId}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto overflow-hidden shadow-lg"
      >
        <CardHeader className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-32 sm:h-48 md:h-56 lg:h-64 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="flex flex-col p-4 bg-white">
          <CardTitle className="text-lg font-bold text-gray-900 mb-2 truncate">
            {" "}
            {video.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 truncate">
            {video.description || "No description available."}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between p-4 space-y-2 sm:space-y-0 sm:space-x-2 bg-gray-50">
          <Button
            onClick={handleAISummaryClick}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Get AI Summary
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default VideoCard;
