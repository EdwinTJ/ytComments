import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AISummary() {
  const { videoId } = useParams<{ videoId: string }>();
  const location = useLocation();
  const { title } = location.state as { title: string };
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState<string | null>(null);

  console.log("id ", videoId);
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/summarize_comments/",
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
      } else {
        console.error("Failed to fetch summary:", data.detail);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  return (
    <section className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">
        AI Summary for Video ID: {title}
      </h1>
      <Textarea
        placeholder="What do you want to know about your comment sections of this video?"
        className="w-full max-w-2xl mb-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button className="bg-blue-500 text-white" onClick={handleSubmit}>
        Submit
      </Button>
      {summary && (
        <div className="w-full max-w-2xl mt-6 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}
    </section>
  );
}
