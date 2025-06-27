import React, { useMemo } from "react";
import Link from "next/link";
import { BsSearch } from "react-icons/bs";
import { BiHomeCircle, BiHash, BiBell, BiEnvelope, BiBookmark, BiListUl, BiUser, BiDotsHorizontalRounded } from "react-icons/bi";
import Image from "next/image";
import { GoogleLogin } from '@react-oauth/google';
import { useCurrentUser } from '@/hooks/user';
import { useGoogleLogin } from '@/hooks/auth';
import toast from 'react-hot-toast';

// VoxStream Simple & Elegant Logo (Twitter-style)
const VoxStreamLogo = () => (
  <div className="relative group">
    <svg 
      width="45" 
      height="45" 
      viewBox="0 0 32 32" 
      className="transition-all duration-200 group-hover:scale-110"
    >
      <defs>
        {/* Simple blue gradient like Twitter */}
        <linearGradient id="voxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1da1f2" />
          <stop offset="100%" stopColor="#0d8bd9" />
        </linearGradient>
      </defs>
      
      {/* VoxStream Icon - Simple "V" with stream lines */}
      <g fill="url(#voxGradient)">
        {/* Main "V" shape - clean and bold */}
        <path 
          d="M8 8 L16 24 L24 8 L20 8 L16 18 L12 8 Z" 
          className="group-hover:brightness-110 transition-all duration-200"
        />
        
        {/* Stream lines - three elegant lines */}
        <g opacity="0.8">
          <rect x="10" y="4" width="8" height="1.5" rx="0.75" />
          <rect x="12" y="6.5" width="10" height="1.5" rx="0.75" />
          <rect x="14" y="9" width="6" height="1.5" rx="0.75" />
        </g>
      </g>
    </svg>
  </div>
);

const TwitterLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useCurrentUser();
  const handleLoginWithGoogle = useGoogleLogin();

  const sidebarMenuItems = useMemo(() => [
    { title: "Home", icon: <BiHomeCircle />, link: "/" },
    { title: "Explore", icon: <BiHash />, link: "/explore" },
    { title: "Notifications", icon: <BiBell />, link: "/notifications" },
    { title: "Messages", icon: <BiEnvelope />, link: "/messages" },
    { title: "Bookmarks", icon: <BiBookmark />, link: "/bookmarks" },
    { title: "Lists", icon: <BiListUl />, link: "/lists" },
    { title: "Profile", icon: <BiUser />, link: user ? `/${user.id}` : "/profile" },
    { title: "More", icon: <BiDotsHorizontalRounded />, link: "/more" }
  ], [user?.id]);

  return (
     <div className="flex min-h-screen max-w-6xl mx-auto"> 
     {/*  middle size  */}
      {/* Left Sidebar */}
      <header className="flex flex-col justify-between w-1/4 py-4 px-8">
        <div>
          <div className="h-12 w-12 cursor-pointer inline-flex items-center justify-center">
            <VoxStreamLogo />
          </div>
          <nav className="mt-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li key={item.title}>
                  <Link href={item.link} className="flex items-center gap-4 text-xl py-3 px-3 hover:bg-gray-200 rounded-full">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="hidden sm:inline">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full w-full mt-4 text-lg">
            Tweet
          </button>
        </div>
        {user && (
          <div className="mb-4 flex items-center gap-2 cursor-pointer hover:bg-gray-200 rounded-full p-3">
            <Image src={user.profileImageURL} alt="Profile" width={40} height={40} className="rounded-full" />
            <div className="flex-grow">
              <p className="font-bold">{user.firstName} {user.lastName}</p>
              <p className="text-gray-500">@{user.firstName}7</p>
            </div>
            <BiDotsHorizontalRounded className="text-xl" />
          </div>
        )}
      </header>

      {/* Main Content */}
      {children}

    
      {/* Right Sidebar */}
      <aside className="w-1/4 py-4 px-4">
        <div className="sticky top-4">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search Twitter" 
              className="bg-gray-100 rounded-full py-2 px-10 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white"
            />
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="bg-gray-50 rounded-2xl overflow-hidden mb-4">
            <h2 className="font-bold text-xl px-4 py-3 border-b border-gray-200">What's happening</h2>
            {/* Trending topics would go here */}
          </div>
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <h2 className="font-bold text-xl px-4 py-3 border-b border-gray-200">Who to follow</h2>
            {user?.recommendedUsers?.map((recommendedUser) => (
              <div key={recommendedUser.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-100">
                <div className="flex items-center">
                  <Image
                    src={recommendedUser.profileImageURL}
                    alt={`${recommendedUser.firstName} ${recommendedUser.lastName}`}
                    width={48}
                    height={48}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-bold text-sm">{recommendedUser.firstName} {recommendedUser.lastName}</p>
                    <p className="text-gray-500 text-sm">@{recommendedUser.firstName.toLowerCase()}{recommendedUser.lastName.toLowerCase()}</p>
                  </div>
                </div>
                <button className="bg-black text-white rounded-full px-4 py-1 text-sm font-bold hover:bg-opacity-80">
                  Follow
                </button>
              </div>
            ))}
            <button  className="block text-blue-500 hover:bg-blue-50 text-sm font-semibold px-4 py-3">
              Show more
            </button>

            </div>
            
          {!user && (
            <div className="mt-4 p-4 bg-slate-800 rounded-lg">
              <h1 className="my-2 text-2xl font-normal text-white font-serif">New to Vox?</h1>
      
              <GoogleLogin
                onSuccess={handleLoginWithGoogle}
                onError={() => {
                  console.log('Login Failed');
                  toast.error('Login Failed');
                }}
              />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default TwitterLayout;