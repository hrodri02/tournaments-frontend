import React, { useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import {
    View,
    Text, 
    Pressable, 
    Alert, 
    StyleSheet,
    ActivityIndicator,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { uploadImageToS3 } from '@/services/tournaments.service';
import { useTranslation } from 'react-i18next'; 
import { ErrorDetails } from '@/entities/error';

type UploadImageComponentProps = {
    logoUrl?: string;
    isLoading: boolean;
    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    updateError: ErrorDetails | null;
    callback: (logoUrl: string) => void;
    setIsLoading: (_: boolean) => void;
}

const UploadImageComponent = ({ isLoading, updateStatus, updateError, logoUrl, callback, setIsLoading }: UploadImageComponentProps) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [s3error, setS3error] = useState<string | null>(null);
    const [fileSizeError, setFileSizeError] = useState<string | null>(null);
    const { t } = useTranslation(['common', 'errors']);
    const MAX_SIZE_BYTES = 1 * 1024 * 1024;

    const pickImage = async () => {
        // 1. Request permission to access the media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert(
                'Permission Denied',
                'Sorry, we need camera roll permissions to make this work!'
            );
            return;
        }

        // 2. Launch the image picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Only allow images
            allowsEditing: true, // Allow user to crop/edit the image
            aspect: [4, 3], // Set the aspect ratio for editing (e.g., a standard photo aspect)
            quality: 1, // Max quality
        });

        // 3. Handle the result
        if (!result.canceled) {
            const selectedAsset = result.assets[0];
            setImageUri(selectedAsset.uri);
            
            let fileSize;
            if (Platform.OS === 'web') {
                const file = selectedAsset.file;
                fileSize = file!.size;
            }
            else {
                const fileInfo = new File(selectedAsset.uri).info();
                fileSize = fileInfo.size;
            }
            
            if (fileSize! > MAX_SIZE_BYTES) {
                const message = t('upload_image.file_size_error');
                setFileSizeError(message);    
            }
        }
    };

    const uploadImage = async () => {
        try {
            setIsLoading(true);
            const imageUrl = await uploadImageToS3(imageUri!, logoUrl);
            const urlWithTimestamp = `${imageUrl}?v=${new Date().getTime()}`;
            callback(urlWithTimestamp);
        }
        catch (err) {
            setIsLoading(false);
            const translationKey = err.message;
            setS3error(t(translationKey));
        }
    }

    const getUpdateErrorMessage = (): string => {
        let errorMessage = "";
        const error = updateError!
        if (error.errorKey === "VALIDATION_FAILED") {
            const validationErrors = error.validationErrors? error.validationErrors : [];
            for (const error of validationErrors) {
                const translationKey = `errors:VALIDATION.${error.field}.${error.errorKey}`;
                errorMessage = t(translationKey) + "\n";
            }
        }
        else {
            const translationKey = error.errorKey
            errorMessage = t(translationKey)
        }
        return errorMessage;
    }

    const skipUpload = () => {
        router.back();
    }

    const convertBytesToMB = (bytes: number): number => {
        return bytes / (1024 * 1024);
    }

    let view: React.JSX.Element = <></>;
    if (isLoading) {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else if (updateStatus === 'idle' || updateStatus === 'failed') {
        view = <View style={styles.container}>
            <View style={[styles.container, styles.perfectCentering]}>
                <Pressable onPress={pickImage}>
                    <Text style={styles.subtext}>{t('upload_image.message')}</Text>
                </Pressable>
                {imageUri && (
                    <Image 
                        source={{ uri: imageUri }} 
                        style={styles.image} 
                    />
                )}
                {fileSizeError && <Text style={styles.errorText}>{fileSizeError} {convertBytesToMB(MAX_SIZE_BYTES)} MB</Text>}
                {s3error && <Text style={styles.errorText}>{s3error}</Text>}
                {updateError && <Text style={styles.errorText}>{getUpdateErrorMessage()}</Text>}
            </View>
            <Pressable 
                onPress={uploadImage} 
                style={[styles.buttonContainer, (imageUri === null || fileSizeError) && styles.buttonDisabled]}
                disabled={imageUri === null || fileSizeError !== null}
            >
                <Text style={styles.buttonText}>{t('upload_image.button')}</Text>
            </Pressable>
            <Pressable onPress={skipUpload}>
                <Text style={styles.centerText}>{t('upload_image.skip_button')}</Text>
            </Pressable>
        </View>
    }
    else if (updateStatus === 'succeeded') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{t('upload_image.success_message')}</Text>
            <Ionicons name="checkmark-circle" size={32} color="green" />
        </View>
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            {view}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        margin: 12
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15
    },
    subtext: {
        fontSize: 16,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    buttonContainer: {
        marginHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        marginBottom: 20,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 5,
    },
    centerText: {
        textAlign: 'center'
    }
});

export default UploadImageComponent;