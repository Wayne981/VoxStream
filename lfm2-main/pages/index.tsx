import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import TweetComposer from '@/components/TweetComposer';
import { useCurrentUser } from '@/hooks/user';
import { useGetAllTweets, useCreateTweet } from '@/hooks/tweet';
import { useGoogleLogin, useLogout } from '@/hooks/auth';
import TwitterLayout from '@/components/Layout/TwitterLayout';
import TweetFeed from '@/components/TweetFeed';
import { GetServerSideProps } from 'next';
import { graphQLClient } from '@/clients/api';
import { getAllTweetsQuery } from '@/graphql/query/tweet';
import { Tweet } from '@/gql/graphql';

interface HomeProps {
  initialTweets: Tweet[];
}

export default function Home({ initialTweets }: HomeProps) {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const { tweets: fetchedTweets, isLoading, error } = useGetAllTweets(initialTweets);
  
  const handleLoginWithGoogle = useGoogleLogin(queryClient);
  const logout = useLogout();
  const { createTweet } = useCreateTweet();

  const [tweets, setTweets] = useState<Tweet[]>(initialTweets || []);

  useEffect(() => {
    if (fetchedTweets) {
      setTweets(fetchedTweets);
    }
  }, [fetchedTweets]);

  const handleTweetCreate = async (content: string, imageUrl?: string) => {
    try {
      const newTweet = await createTweet({ content, imageURL: imageUrl });
  
      // Update local state with the server response
      setTweets(prevTweets => [newTweet, ...prevTweets]);
  
      // Refetch tweets to ensure consistency
      queryClient.invalidateQueries(['all-tweets']);
      toast.success('Tweet posted successfully!');
    } catch (error) {
      console.error("Error creating tweet:", error);
      toast.error("Failed to create tweet. Please try again.");
    }
  };

  if (error) {
    console.error('Error loading tweets:', error);
    return (
      <TwitterLayout>
        <main className="w-1/2 border-x border-gray-200">
          <div className="p-4 text-red-500">Error loading tweets. Please try again later.</div>
        </main>
      </TwitterLayout>
    );
  }

  return (
    <TwitterLayout>
      <main className="w-1/2 border-x border-gray-200">
        <div className="sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm z-10">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-xl font-bold">Home</h1>
            {user && (
              <button 
                onClick={logout} 
                className="text-sm text-red-500 hover:text-red-600 p-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
        <TweetComposer user={user} onTweetCreate={handleTweetCreate} />
        <TweetFeed tweets={tweets} isLoading={isLoading} error={error} />
      </main>
    </TwitterLayout>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const allTweets = await graphQLClient.request(getAllTweetsQuery);
    return {
      props: {
        initialTweets: allTweets.getAllTweets || [],
      },
    };
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return {
      props: {
        initialTweets: [],
      },
    };
  }
};