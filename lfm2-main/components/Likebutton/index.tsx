import React, { useState } from 'react';

const TwitterLikeButton = () => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <button
      className="flex items-center space-x-1 group"
      onClick={toggleLike}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-4 h-4 transition-colors duration-200 ease-in-out ${
          isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500 fill-none group-hover:text-red-500'
        }`}
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          strokeWidth="2"
          stroke="currentColor"
        />
      </svg>
      <span className={`text-sm ${isLiked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`}>
        {/* {isLiked ? 'Liked' : 'Like'} */}
      </span>
    </button>
  );
};

export default TwitterLikeButton;