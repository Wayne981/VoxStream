import React, { useCallback, useMemo, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from 'next/router';
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs";

import TwitterLayout from "@/components/Layout/TwitterLayout";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { User } from "@/gql/graphql";
import { graphQLClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user"

interface ServerProps {
  userInfo?: User;
}

const UserProfilePage: NextPage<ServerProps> = ({ userInfo }) => {
  const { user: currentUser, isLoading, mutate: mutateCurrentUser } = useCurrentUser();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const amIFollowing = useMemo(() => {
    if (!userInfo?.followers) return false;
    return userInfo.followers.some(follower => follower?.id === currentUser?.id);
  }, [currentUser?.id, userInfo?.followers]);

  React.useEffect(() => {
    setIsFollowing(amIFollowing);
  }, [amIFollowing]);

  const handleFollowUser = useCallback(async () => {
    if (!userInfo?.id || isUpdating) return;
    setIsUpdating(true);
    try {
      await graphQLClient.request(followUserMutation, { to: userInfo.id });
      setIsFollowing(true);
      mutateCurrentUser();
      router.replace(router.asPath);
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [userInfo?.id, isUpdating, mutateCurrentUser, router]);

  const handleUnfollowUser = useCallback(async () => {
    if (!userInfo?.id || isUpdating) return;
    setIsUpdating(true);
    try {
      await graphQLClient.request(unfollowUserMutation, { to: userInfo.id });
      setIsFollowing(false);
      mutateCurrentUser();
      router.replace(router.asPath);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [userInfo?.id, isUpdating, mutateCurrentUser, router]);

  if (isLoading) {
    return (
      <TwitterLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">Loading...</p>
        </div>
      </TwitterLayout>
    );
  }

  if (!userInfo) {
    return (
      <TwitterLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">User not found</p>
        </div>
      </TwitterLayout>
    );
  }

  return (
    <TwitterLayout>
      <div className="border-l border-r border-gray-200 min-h-screen">
        <nav className="flex items-center p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
          <BsArrowLeftShort className="text-4xl cursor-pointer" onClick={() => router.back()} />
          <div className="ml-4">
            <h1 className="font-bold text-xl">{userInfo.firstName} {userInfo.lastName}</h1>
            <p className="text-sm text-gray-500">{userInfo.tweets?.length || 0} Tweets</p>
          </div>
        </nav>
        
        <div className="relative">
          <div className="h-48 bg-gray-300"></div>
          <div className="absolute top-36 left-4">
            {userInfo.profileImageURL ? (
              <Image
                src={userInfo.profileImageURL}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-400 border-4 border-white flex items-center justify-center">
                <span className="text-4xl text-white">{userInfo.firstName[0]}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 px-3">
          <div className="flex justify-end">
            {currentUser?.id !== userInfo.id && (
              isFollowing ? (
                <button 
                  className="bg-white text-black px-4 py-2 rounded-full font-bold border border-gray-300 hover:bg-gray-100 transition"
                  onClick={handleUnfollowUser}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Unfollow'}
                </button>
              ) : (
                <button 
                  className="bg-black text-white px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition"
                  onClick={handleFollowUser}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Follow'}
                </button>
              )
            )}
          </div>
          <h1 className="text-2xl font-bold mt-2">
            {userInfo.firstName} {userInfo.lastName}
          </h1>
          <p className="text-gray-500">@{userInfo.firstName.toLowerCase()}{userInfo.lastName.toLowerCase()}</p>
          <div className="flex gap-4 mt-3 text-sm text-gray-500">
            <span><strong className="text-black">{userInfo.following?.length || 0}</strong> Following</span>
            <span><strong className="text-black">{userInfo.followers?.length || 0}</strong> Followers</span>
          </div>
        </div>
        
        <div className="mt-4 border-b border-gray-200"></div>

        <div className="px-4">
          {userInfo.tweets?.map((tweet) => (
            <div key={tweet.id}>
              <FeedCard data={tweet} />
              <div className="border-b-[0.5px] border-gray-100"></div>
            </div>
          ))}
        </div>
      </div>
    </TwitterLayout>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
  const userId = context.query.id as string | undefined;

  if (!userId) return { notFound: true };

  try {
    const userInfo = await graphQLClient.request(getUserByIdQuery, { userId });
    
    if (!userInfo?.getUserById) return { notFound: true };

    return {
      props: {
        userInfo: userInfo.getUserById as User,
      },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { notFound: true };
  }
};

export default UserProfilePage;