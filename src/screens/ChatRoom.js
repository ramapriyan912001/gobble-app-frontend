import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from '../reducers/FirebaseSvc';

//Havent worked on this yet, need to add API calls in backend and over here

export default function ChatRoom() {
  const cUser = firebaseSvc.currentUser();
  const user = {
    name: cUser.displayName,
    email: cUser.email,
    avatar: cUser.photoURL,
    _id: firebaseSvc.uid
  };
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    firebaseSvc.refOn(message => {console.log(message);setMessages(GiftedChat.append(messages, message))});
    return firebaseSvc.refOff();
  }, []);

  console.log(messages);
  return (
        <GiftedChat
          messages={messages}
          onSend={firebaseSvc.send}
          user={user}
        />
  );
};