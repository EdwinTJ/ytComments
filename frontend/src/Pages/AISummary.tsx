import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useSummary } from "@/context/SummaryContext";

interface LocationState {
  title: string;
}

export default function AISummary() {
  const { videoId } = useParams<{ videoId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { title } = location.state as LocationState; // Use type assertion here
  const [prompt, setPrompt] = useState<string>(""); // Specify type for prompt
  const { isAuthenticated } = useAuth();
  const { summary, isLoading, error, getSummary } = useSummary();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  const handleSubmit = () => {
    if (videoId) {
      getSummary(videoId, prompt, title);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <section className="flex flex-col items-center p-8">
        <h1 className="text-2xl font-bold mb-4">
          AI Summary for Video: {title}
        </h1>
        <Textarea
          placeholder="What do you want to know about the comments on this video?"
          className="w-full max-w-2xl mb-4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          className="bg-blue-500 text-white"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Get Summary"}
        </Button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {summary && (
          <div className="w-full max-w-2xl mt-6 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}
        <Button
          className="bg-gray-500 text-white mt-4"
          onClick={() => navigate("/videos")}
        >
          Back to Videos
        </Button>
      </section>
    </div>
  );
}
