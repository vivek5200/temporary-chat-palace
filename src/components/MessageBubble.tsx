
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageBubbleProps {
  content: string;
  sender: string;
  timestamp: string;
  isSelf: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  sender,
  timestamp,
  isSelf
}) => {
  // System messages get a different style
  const isSystem = sender === 'System';

  return (
    <View style={[
      styles.container,
      isSelf ? styles.selfContainer : styles.otherContainer,
      isSystem && styles.systemContainer
    ]}>
      {!isSelf && !isSystem && (
        <Text style={styles.senderName}>{sender}</Text>
      )}
      
      <View style={[
        styles.bubble,
        isSelf ? styles.selfBubble : styles.otherBubble,
        isSystem && styles.systemBubble
      ]}>
        <Text style={[
          styles.message,
          isSystem && styles.systemMessage
        ]}>
          {content}
        </Text>
        
        <Text style={styles.timestamp}>
          {timestamp}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  selfContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  systemContainer: {
    alignSelf: 'center',
    maxWidth: '90%',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 18,
    padding: 12,
  },
  selfBubble: {
    backgroundColor: '#DCF8C6',  // Light green
    borderTopRightRadius: 4,  // Pointed edge on self messages
  },
  otherBubble: {
    backgroundColor: '#fff',  // White
    borderTopLeftRadius: 4,  // Pointed edge on other messages
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  systemBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
  },
  systemMessage: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default MessageBubble;
