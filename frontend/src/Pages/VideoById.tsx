import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useSummary } from "@/context/SummaryContext";

export default function VideoById() {
  const [videoId, setVideoId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const { isAuthenticated } = useAuth();
  const { summary, isLoading, error, setError, getSummary } = useSummary();

  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSubmit = () => {
    if (!videoId.trim()) {
      setError("Please enter a valid Video ID.");
      return;
    }
    getSummary(videoId, prompt);
  };

  return (
    <section className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">AI Summary for Video ID</h1>

      <Input
        type="text"
        placeholder="Enter Video ID"
        className="w-full max-w-2xl mb-4 p-2 border border-gray-300 rounded"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        required
      />

      <Textarea
        placeholder="What do you want to know about the comments of this video?"
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

      {error && <p className="text-red-500 mt-4">{error}</p>}

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
  );
}
