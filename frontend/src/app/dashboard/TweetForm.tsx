import React, { useState } from "react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TweetData {
  text: string;
  author: string;
  media: string[];
}

const TweetForm = () => {
  const [tweetUrl, setTweetUrl] = useState("");
  const [tweetData, setTweetData] = useState<TweetData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTweetData(null);

try {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fetch-tweet`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tweetUrl }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to fetch tweet");

  setTweetData(data.tweet);
} catch (err: any) {
  setError(err.message);
}
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="tweetUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Enter Tweet URL:
        </label>
        <input
          type="text"
          id="tweetUrl"
          value={tweetUrl}
          onChange={(e) => setTweetUrl(e.target.value)}
          placeholder="https://twitter.com/example/status/1234567890"
          className="mt-1 block w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Fetch Tweet
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

      {tweetData && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-semibold">Tweet Details</h3>
          <p>{tweetData.text}</p>
          <p className="text-sm text-gray-500">Author: {tweetData.author}</p>
          {tweetData.media.length > 0 && (
            <div>
              <h4 className="font-semibold mt-2">Media:</h4>
              {tweetData.media.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="mt-2 w-64"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TweetForm;
