import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { VideoCard } from "../components/index.js";
import deviceWidth from "../utils/deviceWidth.js";

function SearchPage() {
  const { state } = useLocation();
  const [params] = useSearchParams();
  const query = params.get("q");
  const [results, setResults] = useState(state?.results?.data || []);
  const [loading, setLoading] = useState(!state?.results);
  const [error, setError] = useState(null);
  const isMobile = deviceWidth();

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/v1/videos", {
        params: { query },
      });
      setResults(response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query) return;

    if (state?.results) {
      setResults(state.results?.data);
    }else{
      fetchResults();
    }
  }, [query, state]);

  if (!query) return <div>No query provided</div>;

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  if (results.length === 0) {
    return (
      <div className="text-2xl text-white m-auto" >
        No Videos found associated with this query. Try something different...
      </div>  
    );
  }

  return (
    <div className="container w-full min-h-screen flex flex-col gap-2 p-4">
      <div>
        <h1 className="text-4xl text-white mb-4 font-bold">
          Your Search Results
        </h1>
        <hr />
      </div>
      {results?.map((result) => (
        <Link
          key={result._id}
          to={`/video/${result._id}`}
          className="w-full overflow-hidden mt-4 "
        >
          <VideoCard
            elem={result}
            className={"flex flex-row gap-2 "}
            thumbnailOrVideoContainerClassName={`${
              isMobile ? "w-40" : "w-64"
            } flex-shrink-0`}
            showDescription={true}
            textsize={isMobile ? "text-sm" : "text-base"}
            imgClassName={"rounded-lg"}
            videoClassName={"rounded-lg"}
            variant="SearchResults"
          />
        </Link>
      ))}
    </div>
  );
}

export default SearchPage;
