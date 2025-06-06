/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdn.pixabay.com",
      "lh3.googleusercontent.com",
      "twitter-bu.s3.ap-south-1.amazonaws.com",
      "voxstreamimgbucket.s3.ap-south-1.amazonaws.com"
    ],
  },
};

export default nextConfig;
