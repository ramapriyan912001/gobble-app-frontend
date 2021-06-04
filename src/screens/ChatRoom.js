import React, { useState, useCallback, useEffect } from 'react'
import { SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import deviceStorage from '../services/deviceStorage'
import Base64 from 'Base64';

//Havent worked on this yet, need to add API calls in backend and over here

export default function ChatRoom() {
  const token = deviceStorage.loadJWT();
  const payload = Base64.atob(token);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: payload.userID,
        text: 'Sample Text',
        createdAt: new Date(),
        user: {
          _id: "60af8815d19c2e233c8765b6",//This info should come through Match id -> other user -> other user info
          name: 'Vishnu',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
      <SafeAreaView>
        <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
            _id: payload.userID,
        }}
        />
    </SafeAreaView>
  );
};