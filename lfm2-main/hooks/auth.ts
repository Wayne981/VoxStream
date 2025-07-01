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
    if (!googleToken) {
      console.error("Google token not found in credential response");
      return toast.error("Google token not found");
    }

    console.log("Google token received, length:", googleToken.length);

    try {
      const { verifyGoogleToken } = await graphQLClient.request(verifyUserGoogleTokenQuery, { 
        token: googleToken 
      });

      console.log("Backend response:", { verifyGoogleToken });

      if (verifyGoogleToken) {
        // Validate the token before storing
        const tokenParts = verifyGoogleToken.split('.');
        if (tokenParts.length !== 3) {
          throw new Error("Invalid JWT token structure received from backend");
        }

        // Clear any existing token first
        window.localStorage.removeItem("_eno_ondh_esru");
        
        // Store the new token
        window.localStorage.setItem("_eno_ondh_esru", verifyGoogleToken);
        
        // Verify the token was stored correctly
        const storedToken = window.localStorage.getItem("_eno_ondh_esru");
        console.log("Token stored successfully:", !!storedToken);
        console.log("Stored token preview:", storedToken?.substring(0, 50) + "...");
        
        toast.success("Verified successfully");
      } else {
        throw new Error("No token received from verification");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      
      // Clear any potentially corrupted token
      window.localStorage.removeItem("_eno_ondh_esru");
      
      if (error instanceof Error) {
        toast.error(`Verification failed: ${error.message}`);
      } else {
        toast.error("Verification failed");
      }
      return;
    }

    // Invalidate queries after successful token storage
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    }, 100); // Small delay to ensure localStorage is updated
  }, [queryClient]);

  return handleLoginWithGoogle;
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    localStorage.removeItem("_eno_ondh_esru"); // JWT key
    queryClient.clear(); // Use clear() instead of removeQueries()
    toast.success("Logged out");
    window.location.href = "/"; // or use router.push("/")
  }, [queryClient]);

  return logout;
};