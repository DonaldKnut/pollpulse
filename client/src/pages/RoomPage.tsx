import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getResults } from "../services/roomService";
import type { Result } from "../types";

const ResultsPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getResults(roomId!);
        setResults(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load results");
      }
    };
    fetchResults();
  }, [roomId]);

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  if (!results.length) {
    return <p className="text-center mt-8">Loading results...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Voting Results</h2>
      <ul className="space-y-4">
        {results.map((result, index) => (
          <li key={index} className="flex justify-between">
            <span>{result.option}</span>
            <span>{result.votes} votes</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;
