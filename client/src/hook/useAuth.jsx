import { useState } from "react";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authenticate = async (url, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://localhost:5000${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-version": "1.0.0",
        },
        body: JSON.stringify(data),
        credentials: 'include', 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData; 
      }

      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { authenticate, loading, error };
};

export default useAuth;