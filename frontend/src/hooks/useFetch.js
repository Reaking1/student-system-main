import { useState, useEffect, useCallback } from "react";

export function useFetch(url, options = {}, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Fetch failed");
      }

      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]); // stringify options to track changes

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies); // allow dynamic refetch based on dependencies

  return { data, loading, error, refetch: fetchData };
}
