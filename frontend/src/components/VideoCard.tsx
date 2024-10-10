import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 truncate">{video.title}</h2>
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-4"
        >
          Watch on YouTube
        </a>
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
      </div>
    </div>
  );
};

export default VideoCard;
