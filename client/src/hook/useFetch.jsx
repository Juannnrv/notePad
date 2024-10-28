import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://localhost:5000${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-version': '1.0.0',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
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
        setData(result.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetch;