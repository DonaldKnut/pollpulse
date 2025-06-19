import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getResults } from "../services/roomService";
import type { Result } from "../types";
import { BarChart2, Loader2, Trophy, ChevronRight } from "lucide-react";

const ResultsPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getResults(roomId!);
        setResults(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load results");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [roomId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4 animate-fadeIn">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center border border-purple-100">
          <div className="text-purple-600 bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-purple-800 mb-2">
            Results Unavailable
          </h3>
          <p className="text-purple-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
          >
            Retry <ChevronRight className="ml-1 w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 animate-fadeIn">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
          <p className="mt-4 text-lg text-purple-700 font-medium">
            Compiling results...
          </p>
        </div>
      </div>
    );
  }

  const maxVotes = Math.max(...results.map((r) => r.votes), 1);
  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
  const winner = results.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <BarChart2 className="w-8 h-8 mr-3" />
              <h1 className="text-2xl sm:text-3xl font-bold">Voting Results</h1>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="font-medium">Total Votes: {totalVotes}</p>
            </div>
          </div>
        </div>

        {/* Results Body */}
        <div className="p-6 sm:p-8">
          <ul className="space-y-6">
            {results
              .sort((a, b) => b.votes - a.votes)
              .map((result, index) => {
                const percentage = Math.round((result.votes / maxVotes) * 100);
                const isWinner =
                  result.option === winner.option && results.length > 1;

                return (
                  <li
                    key={index}
                    className={`group ${
                      isWinner
                        ? "bg-purple-50 rounded-xl p-4 -mx-4 border-l-4 border-purple-500"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`font-medium text-gray-900 truncate ${
                          isWinner ? "text-lg text-purple-800" : ""
                        }`}
                      >
                        {isWinner && (
                          <Trophy className="w-5 h-5 text-yellow-500 inline-block mr-2" />
                        )}
                        {result.option}
                      </span>
                      <span
                        className={`font-medium ${
                          isWinner ? "text-purple-700" : "text-gray-600"
                        }`}
                      >
                        {result.votes} vote{result.votes !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
                          isWinner
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                            : "bg-gradient-to-r from-purple-400 to-purple-500"
                        }`}
                        style={{
                          width: `${percentage}%`,
                          transitionDelay: `${index * 75}ms`,
                        }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm text-gray-500">
                        {percentage}%
                      </span>
                    </div>
                  </li>
                );
              })}
          </ul>

          {results.length > 1 && (
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-2">The winning choice is:</p>
                <div className="inline-block bg-gradient-to-r from-yellow-100 to-purple-50 px-6 py-3 rounded-xl border border-yellow-200">
                  <p className="text-xl font-bold text-purple-800 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                    {winner.option}
                  </p>
                  <p className="mt-1 text-gray-600">
                    Won with {Math.round((winner.votes / totalVotes) * 100)}% of
                    votes
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
