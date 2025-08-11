'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false
  });

  const handleError = (error: Error | string, context?: string) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    console.error(`Error ${context ? `in ${context}` : ''}:`, error);
    
    setErrorState({
      hasError: true,
      error: typeof error === 'string' ? new Error(error) : error
    });

    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const clearError = () => {
    setErrorState({ hasError: false });
  };

  const handleAsyncOperation = async function<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  };

  return {
    errorState,
    handleError,
    clearError,
    handleAsyncOperation
  };
}

// Generic error boundary component
export function ErrorFallback({ 
  error, 
  resetError, 
  context = 'application' 
}: { 
  error: Error; 
  resetError: () => void; 
  context?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="ml-3 text-lg font-semibold text-gray-900">
            Something went wrong
          </h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          An error occurred in the {context}. Please try refreshing the page or contact support if the problem persists.
        </p>
        
        <details className="mb-4">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Technical details
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
        
        <button
          onClick={resetError}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
