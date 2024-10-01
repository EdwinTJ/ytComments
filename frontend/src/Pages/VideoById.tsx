import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function VideoById() {
  const [videoId, setVideoId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing.");
      setError("Token is missing.");
      return;
    }

    console.log("ID :", videoId);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/comments/summarize_comments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ video_id: videoId, prompt }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
        setError(null); // Reset error if the request was successful
      } else {
        console.error("Failed to fetch summary:", data.detail);
        setError(data.detail);
        setSummary(null); // Reset summary on error
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setError("Error fetching summary.");
      setSummary(null); // Reset summary on error
    }
  };

  return (
    <section className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">AI Summary for Video ID</h1>

      <input
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

      <Button className="bg-blue-500 text-white" onClick={handleSubmit}>
        Submit
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {summary && (
        <div className="w-full max-w-2xl mt-6 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}
    </section>
  );
}
