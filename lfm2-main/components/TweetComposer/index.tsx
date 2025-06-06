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
    setIsUploading(true);
    try {
      console.log('Requesting signed URL for:', file.name, file.type);
      const { getSignedUrlForTweet } = await graphQLClient.request(getSignedURLForTweetQuery, {
        imageName: file.name,
        imageType: file.type,
      });

      console.log('Received signed URL:', getSignedUrlForTweet);

      if (getSignedUrlForTweet) {
        toast.loading('Uploading image...', { id: '2' });
        
        console.log('Uploading file to S3...');
        await axios.put(getSignedUrlForTweet, file, {
          headers: { 'Content-Type': file.type }
        });
        
        console.log('Upload completed');
        toast.success('Upload completed', { id: '2' });

        const url = new URL(getSignedUrlForTweet);
        const myFilePath = `${url.origin}${url.pathname}`;
        console.log('Setting image URL:', myFilePath);
        setImageURL(myFilePath);
        setSelectedImage(URL.createObjectURL(file));
      } else {
        throw new Error('No signed URL received');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image', { id: '2' });
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
        handleInputChangeFile(file);
      }
    });

    input.click();
  }, [handleInputChangeFile]);

  const handleCreateTweet = useCallback(async () => {
    if (content.trim()) {
      try {
        console.log('Creating tweet with content:', content, 'and image URL:', imageURL);
        await onTweetCreate(content, imageURL);
        // await onTweetCreate(content, imageURL || undefined);
        console.log('Tweet created successfully');
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

  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="flex gap-1">

{user && <div className="w-10 h-10 rounded-full overflow-hidden"><Image src={user.profileImageURL} alt={user.name || "Profile"} width={40} height={40} className="object-cover" /></div>}
<div className="flex-grow ml-3">
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-xl placeholder-gray-600 focus:outline-none resize-none" 
            placeholder="What's happening?"
            rows={1}
          />
          {selectedImage && (
            <div className="mt-1 relative">
              <img src={selectedImage} alt="Selected" className="max-w-full rounded-lg" />
              <button 
                className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                onClick={() => {
                  setSelectedImage(null);
                  setImageURL("");
                }}
              >
                X
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2.5 text-blue-400">
              {/* <button onClick={handleSelectImage} disabled={isUploading}>
                {isUploading ? 'Uploading...' : <BiImageAlt />}
              </button> */}

<button 
  onClick={handleSelectImage} 
  disabled={isUploading}
  className="p-2 rounded-full hover:bg-gray-200 transition duration-200 ease-in-out"
>
  {isUploading ? 'Uploading...' : <BiImageAlt />}
</button>
              <button><AiOutlineGif /></button>
              <button><BsEmojiSmile /></button>
              <button><IoCalendarNumberOutline /></button>
              <button><HiOutlineLocationMarker /></button>
            </div>
            <button 
              onClick={handleCreateTweet} 
              disabled={!content.trim() || isUploading}
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
            >
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetComposer;