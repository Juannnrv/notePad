import { useState } from "react";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authenticate = async (url, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-version": "1.0.0",
        },
        body: JSON.stringify(data),
        credentials: 'include', 
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 429) {
          navigate('/');
          return;
        }

        const errorData = await response.json();
        if (errorData.message === 'Validation errors') {
          setError(errorData.data.map(err => err.msg).join(', '));
          return;
        }
        throw new Error(errorData.message || 'Something went wrong');
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