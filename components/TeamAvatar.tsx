import React from 'react';
import { ImageFetcher } from '@/components/ImageFetcher';
import { TeamMonogram } from '@/components/TeamMonogram';

type TeamAvatarProps = {
    logoUrl: string | undefined;
    name: string;
    size: number;
}

export function TeamAvatar({ logoUrl, name, size }: TeamAvatarProps) {
    if (logoUrl) {
        return (
            <ImageFetcher
                imageUrl={logoUrl}
                defaultImageSource={undefined}
                imageStyle={{ width: size, height: size, borderRadius: size / 2 }}
            />
        );
    }
    return <TeamMonogram name={name} size={size} />;
}
