
// Define URL parameters for React Router
export interface RouteParams {
  roomId?: string;
  chatId?: string;
}

// This is for backward compatibility with any existing code
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Home: undefined;
  CreateRoom: undefined;
  JoinRoom: undefined;
  Chat: { roomId?: string; chatId?: string };
};
