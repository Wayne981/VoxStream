import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { createTweetMutation } from "@/graphql/mutation/tweet";
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import { graphQLClient } from "@/clients/api";
import toast from 'react-hot-toast';
import { CreateTweetData } from "@/gql/graphql";



export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateTweetData) =>
      graphQLClient.request(createTweetMutation, { payload }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(["all-tweets"]);
      toast.success('Tweet Created Successfully', { id: "1" });
    },
  });

  const createTweet = async (payload: CreateTweetData) => {
    const result = await mutation.mutateAsync(payload);
    return result.createTweet;
  };

  return { createTweet };
};

  export const useGetAllTweets = (initialTweets: Tweet[]) => {
    return useQuery({
      queryKey: ["all-tweets"],
      queryFn: async () => {
        const response = await graphQLClient.request(getAllTweetsQuery);
        return response.getAllTweets;
      },
      initialData: initialTweets,
      onError: (error) => {
        console.error("Error fetching tweets:", error);
      },
    });
  };