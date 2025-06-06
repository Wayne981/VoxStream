{/* I'm forever the 21-year-old 5-year-old. I'm forever the 5-year-old of something. */}

import React, { useState } from 'react';
import Image from "next/image";
import { BiMessageRounded, BiHeart } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { Tweet } from "@/gql/graphql";
import Link from 'next/link';
import AnimatedLikeButton from '../Likebutton';

interface FeedCardProps {
  data: Tweet
}

const FeedCard: React.FC<FeedCardProps> = ({ data }) => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => setIsLiked(!isLiked);

  return (
    <div className="border-b border-gray-200 p-4 bg-white">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <Image
            src={data.author?.profileImageURL || "/default-avatar.png"}
            alt="User Avatar"
            height={40}
            width={40}
            className="rounded-full"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">
            <Link href={`/${data.author.id}`}>{data.author?.firstName} {data.author?.lastName}</Link> 
            </span>
            <span className="text-gray-500 text-sm">
              @{data.author?.firstName?.toLowerCase()}_{data.author?.lastName?.toLowerCase()}
            </span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">
              {/* {new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} */}
              {"Mar 20"}
            </span>
           
          </div>
          <p className="mt-1 text-gray-800 text-[15px] font-sans">
  {data.content}
</p>
          {data.imageURL && (
            <div className="mt-1 rounded-2xl overflow-hidden border border-gray-200">
              <Image src={data.imageURL} alt="Tweet Image" height={300} width={500} className="w-full h-auto object-cover" />
            </div>
          )}
          <div className="flex justify-between mt-2 text-gray-500 max-w-md">
          <button className="flex items-center space-x-1 group pl-4">
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-4 h-4 text-gray-500 transition-colors duration-200 ease-in-out group-hover:text-blue-500"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
 
</button>
           <button className="flex items-center space-x-2 group">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5 text-gray-500 transition-colors duration-200 ease-in-out group-hover:text-blue-500">
    <path d="M18 7l3 3-3 3"/>
    <path d="M21 10H7a4 4 0 0 0-4 4v2"/>
    <path d="M6 17l-3 3 3 3"/>
    <path d="M3 20h14a4 4 0 0 0 4-4v-2"/>
  </svg>
  <span className="text-sm text-gray-500 transition-colors duration-200 ease-in-out group-hover:text-blue-500">
   
  </span>
</button>
            {/* <button className="flex items-center space-x-2" onClick={toggleLike}>
              <BiHeart 
                className={`text-xl ${isLiked ? 'text-red-500' : 'text-gray-500'}`} 
              />
              <span className={`text-sm ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
               
              </span>
            </button> */}
            {/* <AnimatedLikeButton /> */}
            <button 
  className="flex items-center space-x-1 group"
  onClick={toggleLike}
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={isLiked ? "currentColor" : "none"}
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`w-4 h-4 transition-colors duration-200 ease-in-out
      ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 group-hover:text-red-400'}`}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
  <span 
    className={`text-xs transition-colors duration-200 ease-in-out
      ${isLiked ? 'text-red-500 group-hover:text-red-600' : 'text-gray-500 group-hover:text-red-400'}`}
  >
   
  </span>
</button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;