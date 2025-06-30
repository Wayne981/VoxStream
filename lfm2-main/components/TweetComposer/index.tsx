import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { BiImageAlt } from 'react-icons/bi';
import { AiOutlineGif } from 'react-icons/ai';
import { BsEmojiSmile } from 'react-icons/bs';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { getSignedURLForTweetQuery } from '@/graphql/query/tweet';
import { graphQLClient } from '@/clients/api';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface TweetComposerProps {
  user: any;
  onTweetCreate: (content: string, image?: string) => Promise<void>;
}

const TweetComposer: React.FC<TweetComposerProps> = ({ user, onTweetCreate }) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChangeFile = useCallback(async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    const toastId = toast.loading('Uploading image...');
    
    try {
      console.log('Requesting signed URL for:', file.name, file.type);
      
      const { getSignedUrlForTweet } = await graphQLClient.request(getSignedURLForTweetQuery, {
        imageName: file.name,
        imageType: file.type,
      });

      console.log('Received signed URL response:', getSignedUrlForTweet);

      if (!getSignedUrlForTweet) {
        throw new Error('No signed URL received from server');
      }

      // Parse the JSON response containing both signedURL and publicURL
      const { signedURL, publicURL } = JSON.parse(getSignedUrlForTweet);
      
      if (!signedURL || !publicURL) {
        throw new Error('Invalid signed URL response format');
      }
      
      console.log('Uploading file to S3 using signed URL...');
      
      // Upload to S3 with proper headers
      const uploadResponse = await axios.put(signedURL, file, {
        headers: { 
          'Content-Type': file.type 
        },
        timeout: 30000, // 30 second timeout
      });
      
      console.log('Upload response status:', uploadResponse.status);
      
      if (uploadResponse.status === 200) {
        console.log('Upload completed successfully');
        toast.success('Image uploaded successfully', { id: toastId });

        // Set the public URL for the tweet
        console.log('Setting image URL:', publicURL);
        setImageURL(publicURL);
        setSelectedImage(URL.createObjectURL(file));
      } else {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Upload error response:', error.response.status, error.response.data);
          toast.error(`Upload failed: ${error.response.status}`, { id: toastId });
        } else if (error.request) {
          console.error('Upload error - no response received');
          toast.error('Upload failed: Network error', { id: toastId });
        } else {
          console.error('Upload error:', error.message);
          toast.error(`Upload failed: ${error.message}`, { id: toastId });
        }
      } else {
        toast.error('Failed to upload image', { id: toastId });
      }
      
      // Reset image state on error
      setSelectedImage(null);
      setImageURL("");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.addEventListener('change', (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB');
          return;
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Please select a valid image file (JPEG, PNG, WebP)');
          return;
        }
        
        handleInputChangeFile(file);
      }
    });

    input.click();
  }, [handleInputChangeFile]);

  const handleCreateTweet = useCallback(async () => {
    if (content.trim()) {
      try {
        console.log('Creating tweet with content:', content, 'and image URL:', imageURL);
        
        // Only pass imageURL if it's not empty
        await onTweetCreate(content, imageURL || undefined);
        
        console.log('Tweet created successfully');
        
        // Reset form
        setContent('');
        setSelectedImage(null);
        setImageURL("");
        
        toast.success('Tweet posted successfully!');
      } catch (error) {
        console.error('Error creating tweet:', error);
        toast.error('Failed to post tweet');
      }
    }
  }, [content, imageURL, onTweetCreate]);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setImageURL("");
  }, []);

  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="flex gap-1">
        {user && (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image 
              src={user.profileImageURL} 
              alt={user.name || "Profile"} 
              width={40} 
              height={40} 
              className="object-cover" 
            />
          </div>
        )}
        <div className="flex-grow ml-3">
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-xl placeholder-gray-600 focus:outline-none resize-none" 
            placeholder="What's happening?"
            rows={1}
          />
          
          {selectedImage && (
            <div className="mt-3 relative">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="max-w-full max-h-80 rounded-lg object-cover" 
              />
              <button 
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90 transition-opacity"
                onClick={removeImage}
                type="button"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2.5 text-blue-400">
              <button 
                onClick={handleSelectImage} 
                disabled={isUploading}
                className="p-2 rounded-full hover:bg-gray-200 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {isUploading ? (
                  <span className="text-sm">Uploading...</span>
                ) : (
                  <BiImageAlt size={20} />
                )}
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 transition duration-200" disabled>
                <AiOutlineGif size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 transition duration-200" disabled>
                <BsEmojiSmile size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 transition duration-200" disabled>
                <IoCalendarNumberOutline size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 transition duration-200" disabled>
                <HiOutlineLocationMarker size={20} />
              </button>
            </div>
            <button 
              onClick={handleCreateTweet} 
              disabled={!content.trim() || isUploading}
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              type="button"
            >
              {isUploading ? 'Uploading...' : 'Tweet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetComposer;