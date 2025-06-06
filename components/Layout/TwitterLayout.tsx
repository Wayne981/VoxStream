import React, { ReactNode, useMemo } from 'react';
import { BiHomeCircle, BiUser } from 'react-icons/bi';
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from 'react-icons/bs';
import { useCurrentUser } from '@/hooks/user';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useGoogleLogin } from '@/hooks/auth';

interface TwitterLayoutProps {
  children: ReactNode;
}

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = ({ children }) => {
  const { user } = useCurrentUser();
  const router = useRouter();
  const handleLoginWithGoogle = useGoogleLogin();

  const sidebarMenuItems: TwitterSidebarButton[] = useMemo(() => {
    const items = [
      {
        title: 'Home',
        icon: <BiHomeCircle />,
        link: '/',
      },
      {
        title: 'Notifications',
        icon: <BsBell />,
        link: '/notifications',
      },
      {
        title: 'Messages',
        icon: <BsEnvelope />,
        link: '/messages',
      },
      {
        title: 'Bookmarks',
        icon: <BsBookmark />,
        link: '/bookmarks',
      },
    ];

    if (user) {
      items.push({
        title: 'Profile',
        icon: <BiUser />,
        link: `/${user.id}`,
      });
    }

    return items;
  }, [user]);

  return (
    <div className="w-full h-full flex justify-center">
      <div className="max-w-screen-xl w-full h-full flex relative">
        <div className="fixed h-screen flex flex-col w-[275px] items-stretch px-6">
          <div className="flex flex-col items-stretch h-full space-y-4 mt-4">
            <BsTwitter className="text-3xl" />
            {sidebarMenuItems.map((item) => (
              <button
                key={item.title}
                className="hover:bg-gray-200 transition-all rounded-full p-2 px-6 flex items-center space-x-4 text-xl"
                onClick={() => router.push(item.link)}
              >
                <div>{item.icon}</div>
                <div>{item.title}</div>
              </button>
            ))}
            {user && (
              <div className="mb-4 flex items-center gap-2 cursor-pointer hover:bg-gray-200 rounded-full p-3">
                <Image 
                  src={user.profileImageURL || "/default-avatar.png"} 
                  alt="Profile" 
                  width={40} 
                  height={40} 
                  className="rounded-full" 
                />
                <div className="flex-grow">
                  <p className="font-bold">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-500">@{user.firstName}7</p>
                </div>
              </div>
            )}
            {!user && (
              <button
                onClick={() => handleLoginWithGoogle()}
                className="bg-blue-500 text-white rounded-full w-full py-2 px-4"
              >
                Sign&nbsp;in
              </button>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default TwitterLayout; 