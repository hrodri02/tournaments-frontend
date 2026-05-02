import React, { useEffect, useState } from 'react';
import {
  Pressable, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Platform
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginForm() {
  const [ isPasswordInputFocused, setIsPasswordInputFocused ] = useState<boolean>(false);
  const [ isEmailInputFocused, setIsEmailInputFocused ] = useState<boolean>(false);
  const [ isPasswordVisible, setIsPasswordVisible ] = useState<boolean>(false);
  const { login, dontRememberMe, isLoading, error, user, isAuthenticated, rememberMe } = useAuth();
  const { t } = useTranslation('login');
  const emailInputRef = React.useRef(null);
  const passwordInputRef = React.useRef(null);
  const { control, handleSubmit, setValue, watch } = useForm<LoginFormData>({
    defaultValues: {
      email: (rememberMe && user)? user.email : '',
      password: '',
      rememberMe: rememberMe,
    },
  });
  const rememberMeValue = watch('rememberMe');

  useEffect(() => {
    // When rememberMe is toggled OFF after logging out
    if (!rememberMeValue && user) {
      // Reset the email field to an empty string
      setValue('email', '');
      // removes the user from memory
      dontRememberMe();
    } 
  }, [rememberMeValue, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    const { rememberMe, ...credentials } = data;
    await login(credentials, rememberMe);
  };

  useEffect(() => {
    if (error) {
      console.error(error);
    } else if (isAuthenticated && user) {
      router.replace("/(app)/home");
    }
  }, [error, user]);

  const handleDevLogin = () => {
    setValue('email', 'user@example.com');
    setValue('password', 'password123');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('greeting')}</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Pressable style={[styles.inputContainer, isEmailInputFocused && styles.inputContainerFocused]} onPress={() => emailInputRef.current.focus()}>
            <TextInput
              ref={emailInputRef}
              style={[styles.input, error && styles.inputError]}
              placeholder={t('username_placeholder')}
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              onFocus={() => setIsEmailInputFocused(true)}
              onBlur={() => setIsEmailInputFocused(false)}
              underlineColorAndroid="transparent"
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </Pressable>
        )}
      />
      
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Pressable style={[styles.inputContainer, isPasswordInputFocused && styles.inputContainerFocused]} onPress={() => passwordInputRef.current.focus()}>
            <TextInput
              ref={passwordInputRef}
              style={[styles.input, error && styles.inputError]}
              placeholder={t('password_placeholder')}
              value={value}
              onChangeText={onChange}
              secureTextEntry={!isPasswordVisible}
              onFocus={() => setIsPasswordInputFocused(true)}
              onBlur={() => setIsPasswordInputFocused(false)}
              underlineColorAndroid="transparent"
            />
            <Text style={styles.underlineText} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible? 'Hide' : 'Show'}</Text>
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </Pressable>
        )}
      />

      <Controller
        control={control}
        name="rememberMe"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={styles.section}>
          <CheckBox
            style={styles.checkbox}
            value={value}
            onValueChange={onChange}
            color={value ? '#4630EB' : undefined}
          />
          <Text style={styles.paragraph}>Remember me</Text>
        </View>
        )}
      />
      
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? t('button_loading') : t('button')}
        </Text>
      </TouchableOpacity>

      {__DEV__ && (
        <TouchableOpacity
          style={styles.devButton}
          onPress={handleDevLogin}
        >
          <Text style={styles.devButtonText}>{t('dev_button')}</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={styles.link}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.linkText}>{t('create_account_link')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputContainerFocused: {
    borderColor: '#007AFF', // The "Highlight" color
    borderWidth: 2, // Optional: make it thicker when focused
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none'
      }
    })
  },
  inputError: {
    borderColor: 'red',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
  underlineText: {
    textDecorationLine: 'underline'
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    margin: 8,
  },
  paragraph: {
    fontSize: 12
  },
  devButton: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  devButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 