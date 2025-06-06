import { graphQLClient } from "@/clients/api";
import { getCurrentUserQuery, getUserByIdQuery } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/gql/graphql";

export const useGetUserProfile = (userId: string) => {
  console.log('UserId in useGetUserProfile:', userId); // Add this for debugging

  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      console.log('Querying getUserById with:', userId); // Add this to track the query
      const { getUserById } = await graphQLClient.request(getUserByIdQuery, { userId });
      return getUserById;
    },
    enabled: !!userId,
  });
};

export const useCurrentUser = () => {
  const query = useQuery<{ getCurrentUser: User | null }>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { getCurrentUser } = await graphQLClient.request(getCurrentUserQuery);
      return { getCurrentUser };
    },
  });

  return {
    user: query.data?.getCurrentUser || null,
    isLoading: query.isLoading,
    mutate: query.refetch
  };
};

