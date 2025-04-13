
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import HomePage from '../screens/HomePage';
import CreateRoomScreen from '../screens/CreateRoomScreen';
import JoinRoomScreen from '../screens/JoinRoomScreen';
import ChatPage from '../screens/ChatPage';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen 
          name="CreateRoom" 
          component={CreateRoomScreen} 
          options={{
            headerShown: true,
            headerTitle: 'Create Room',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen 
          name="JoinRoom" 
          component={JoinRoomScreen} 
          options={{
            headerShown: true,
            headerTitle: 'Join Room',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="Chat" component={ChatPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
