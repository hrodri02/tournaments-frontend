import React, {ReactNode} from 'react';
import { Text, ViewStyle, Pressable, } from 'react-native';
import { Link } from 'expo-router';
import { type Href } from 'expo-router'; 

type MyAccountExcerptProps = {
    children: ReactNode;
    style?: ViewStyle;
    pathname: string;
}

export function MyAccountExcerpt({ children, style, pathname }: MyAccountExcerptProps) {
    const linkHref: Href = { pathname: pathname } as Href;
    return (
        <Link href={linkHref} asChild>
            <Pressable>
                <Text style={style}>{children}</Text>
            </Pressable>
        </Link>
    );
}