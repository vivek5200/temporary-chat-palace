
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkUserAuth = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        
        // Navigate after a 2 second delay
        setTimeout(() => {
          if (userString) {
            navigation.replace('Home');
          } else {
            navigation.replace('Auth');
          }
        }, 2000);
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigation.replace('Auth');
      }
    };
    
    checkUserAuth();
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>TC</Text>
        </View>
        <Text style={styles.appName}>TempChat</Text>
      </View>
      <Text style={styles.tagline}>Create temporary chat rooms, instantly</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  tagline: {
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});

export default SplashScreen;
