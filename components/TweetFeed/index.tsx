import React from 'react';
import FeedCard from '../FeedCard';
import { Tweet } from '@/gql/graphql';

interface TweetFeedProps {
  tweets: Tweet[];
  isLoading: boolean;
  error: Error | null;
}

const TweetFeed: React.FC<TweetFeedProps> = ({ tweets, isLoading, error }) => {
  if (isLoading) {
    return <div className="p-4">Loading tweets...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading tweets</div>;
  }

  return (
    <div>
      {tweets?.map((tweet) => (
        <FeedCard key={tweet.id} data={tweet} />
      ))}
    </div>
  );
};

export default TweetFeed; 