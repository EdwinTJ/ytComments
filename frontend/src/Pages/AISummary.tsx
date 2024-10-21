import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { clearStoredTokens } from "../utils/auth";
import api from "../api";

interface LocationState {
  title: string;
}

export default function AISummary() {
  const { videoId } = useParams<{ videoId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { title } = location.state as LocationState; // Use type assertion here
  const [prompt, setPrompt] = useState<string>(""); // Specify type for prompt
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
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
    } catch (error: unknown) {
      // Specify error type as unknown
      console.error("Error fetching summary:", error);
      if (error instanceof Error) {
        // Check if error is an instance of Error
        if ((error as any).response && (error as any).response.status === 401) {
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
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">AI Summary for Video: {title}</h1>
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
  );
}
