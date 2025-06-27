import { useCallback } from 'react';
import { CredentialResponse } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { graphQLClient } from '@/clients/api';
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  const handleLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
    const googleToken = cred.credential;
    if (!googleToken) return toast.error(`Google token not found`);
    
    try {
      const { verifyGoogleToken } = await graphQLClient.request(verifyUserGoogleTokenQuery, { token: googleToken });
  
      if (verifyGoogleToken) {
        window.localStorage.setItem("_eno_ondh_esru", verifyGoogleToken);
        toast.success("Verified successfully");
        console.log(verifyGoogleToken);
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("Verification failed");
    }
    
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    }, 0);
  }, [queryClient]);

  return handleLoginWithGoogle;
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    localStorage.removeItem("_eno_ondh_esru"); // JWT key
    queryClient.removeQueries(); // optional: clears cache
    toast.success("Logged out");
    window.location.href = "/"; // or use router.push("/")
  }, [queryClient]);

  return logout;
};