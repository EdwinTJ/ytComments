import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { clearStoredTokens } from "../utils/auth";
import api from "../api";

export default function VideoById() {
  const [videoId, setVideoId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!videoId.trim()) {
      setError("Please enter a valid Video ID.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await api.post("/api/summarize_comments", {
        video_id: videoId,
        prompt,
      });

      if (response.data && response.data.summary) {
        setSummary(response.data.summary);
      } else {
        setError("Failed to fetch summary. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      const error = err as { response?: { status: number } }; // Type assertion
      if (error.response && error.response.status === 401) {
        clearStoredTokens();
        navigate("/login", {
          state: {
            message: "Please log in again to access this feature.",
          },
        });
      } else {
        setError(
          "An error occurred while fetching the summary. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
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
