import React from 'react';
import FeedCard from '@/components/FeedCard';
import { Tweet } from '@/gql/graphql';

interface TweetFeedProps {
  tweets: Tweet[];
  isLoading: boolean;
  error: any;
}

const TweetFeed: React.FC<TweetFeedProps> = ({ tweets, isLoading, error }) => {
  if (isLoading) return <div>Loading tweets...</div>;
  if (error) return <div>Error loading tweets: {error.message}</div>;
  if (!tweets || tweets.length === 0) return <div>No tweets found.</div>;

  return (
    <div>
      {tweets.map((tweet) => (
        <FeedCard key={tweet.id} data={tweet} />
      ))}
    </div>
  );
};

export default TweetFeed;