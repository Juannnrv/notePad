import { useState, useEffect } from 'react';

const useFetchNotes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:5000/notes', {
          headers: {
            "x-version": "1.0.0",
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw errorData; 
        }

        const result = await response.json();
        console.log(result.data);
        setData(result.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetchNotes;