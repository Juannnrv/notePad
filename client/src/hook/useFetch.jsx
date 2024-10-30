import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useFetch = (initialEndpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ status, setStatus ] = useState(null);
  const navigate = useNavigate();

  const fetchData = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://note-pad-api.vercel.app/notes${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          "x-version": "1.0.0",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 429) {
          navigate("/");
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const result = await response.json();
      setData(result.data);
      setStatus(result.status);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(initialEndpoint);
  }, [initialEndpoint]);

  return { data, loading, error, status, fetchData };
};

export default useFetch;
