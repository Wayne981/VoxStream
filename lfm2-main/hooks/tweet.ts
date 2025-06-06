import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { createTweetMutation, deleteTweetMutation } from "@/graphql/mutation/tweet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "@/clients/api";
import toast from 'react-hot-toast';
import { CreateTweetData, Tweet } from "@/gql/graphql";

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

export const useDeleteTweet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) =>
      graphQLClient.request(deleteTweetMutation, { id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["all-tweets"]);
      toast.success('Tweet deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.errors?.[0]?.message || 'Failed to delete tweet');
    }
  });

  const deleteTweet = async (id: string) => {
    await mutation.mutateAsync(id);
  };

  return { deleteTweet, isDeleting: mutation.isLoading };
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