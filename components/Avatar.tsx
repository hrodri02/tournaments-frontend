import React from 'react';
import { ImageFetcher } from '@/components/ImageFetcher';
import { Monogram } from '@/components/Monogram';

type AvatarProps = {
    logoUrl: string | undefined;
    name: string;
    size: number;
}

export function Avatar({ logoUrl, name, size }: AvatarProps) {
    if (logoUrl) {
        return (
            <ImageFetcher
                imageUrl={logoUrl}
                defaultImageSource={undefined}
                imageStyle={{ width: size, height: size, borderRadius: size / 2 }}
            />
        );
    }
    return <Monogram name={name} size={size} />;
}
