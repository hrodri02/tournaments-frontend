import React, { useState, useEffect } from 'react';
import { Image, ImageSource } from 'expo-image';
import { ActivityIndicator, ImageStyle } from 'react-native';

type ImageFetcherProps = {
  imageStyle?: ImageStyle;
  imageUrl: string | undefined;
  defaultImageSource: number | undefined;
}

export function ImageFetcher({ imageUrl, defaultImageSource, imageStyle }: ImageFetcherProps) {
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<number | ImageSource | undefined>(undefined);

  useEffect(() => {
    const fetchS3Url = async () => {
      try {
        // --- Replace this with your actual URL fetching logic ---

        // if custom image exists
        if (imageUrl) {
          // remove timestamp
          const index = imageUrl.indexOf("?");
          const baseUrl = imageUrl.slice(0, index);
          // use custom image
          setSource({ uri: baseUrl });
        }
        else {
        // use default image
          setSource(defaultImageSource);
        }
        // 1. If using **Public URL (Option A)**:
        // const publicUrl = `https://my-expo-assets-bucket.s3.us-east-1.amazonaws.com/${s3Key}`;
        // setImageUrl(publicUrl);

        // 2. If using **Pre-Signed URL (Option B)**:
        // const response = await fetch(`YOUR_BACKEND_API/getImageUrl?key=${s3Key}`);
        // const data = await response.json();
        
        // setImageUrl(data.signedUrl); // Assuming your backend returns { signedUrl: "..." }

      } catch (error) {
        console.error("Failed to fetch image URL:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchS3Url();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Image
      source={source}
      style={imageStyle}
    />
  );
};