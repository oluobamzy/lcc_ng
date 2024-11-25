import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Oops! Page not found.</p>
        <p className="text-gray-500 mt-2">The page you’re looking for might have been removed or temporarily unavailable.</p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition"
          >
            Go back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;