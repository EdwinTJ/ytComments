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
interface Video {
  videoId: string;
  thumbnail: string;
  title: string;
  description?: string;
}

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();

  return (
    <section>
      <Card
        key={video.videoId}
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
            className="w-full bg-green-500 text-white"
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
    </section>
  );
};

export default VideoCard;
