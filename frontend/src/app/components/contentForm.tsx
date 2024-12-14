"use client";

import { useState, FormEvent } from "react";

interface RepurposedContent {
  videoCaption: string;
  socialMediaCaption: string;
}

export default function ContentForm() {
  const [tweet, setTweet] = useState<string>("");
  const [repurposedContent, setRepurposedContent] =
    useState<RepurposedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!tweet.trim()) {
      setError("Tweet text is required");
      setRepurposedContent(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/content/transform-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tweet }),
      });

      if (!response.ok) {
        throw new Error("Failed to repurpose content");
      }

      const data: RepurposedContent = await response.json();
      setRepurposedContent(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setRepurposedContent(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Repurpose Your Tweet
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder="Enter your tweet here..."
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Repurposing..." : "Repurpose"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {repurposedContent && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Video Caption:
            </h3>
            <p className="mt-1 bg-gray-100 p-3 rounded-md text-gray-800">
              {repurposedContent.videoCaption}
            </p>
            <h3 className="text-lg font-semibold text-gray-700 mt-4">
              Social Media Caption:
            </h3>
            <p className="mt-1 bg-gray-100 p-3 rounded-md text-gray-800">
              {repurposedContent.socialMediaCaption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
