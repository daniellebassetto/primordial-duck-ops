import { useState } from 'react';

export const useApiError = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApiCall = async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      
      const errorMessage = err.message || 'Erro desconhecido';
      const errorDetails = err.errors || [];
      
      setError({
        message: errorMessage,
        details: errorDetails,
        status: err.status
      });
      
      throw err;
    }
  };

  const clearError = () => setError(null);

  return {
    error,
    loading,
    handleApiCall,
    clearError
  };
};