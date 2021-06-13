
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from '../reducers/FirebaseSvc';

//Haven't worked on this yet, need to add API calls in backend and over here

export default function ChatRoom() {
  const cUser = firebaseSvc.currentUser();
  const user = {
    name: cUser.displayName,
    email: cUser.email,
    avatar: cUser.photoURL,
    _id: firebaseSvc.uid
  };
  const [messages, setMessages] = useState([]);

  const loadMessages = () => {
    firebaseSvc.refRetrieve(message => setMessages(GiftedChat.append(messages, message)));//Errors occurs here
  };

  const updateMessages = (messageList) => {
    firebaseSvc.send(messageList);
    firebaseSvc.refOn(message => setMessages(GiftedChat.append(messages, message)));
    return firebaseSvc.refOff();
  };

  useEffect(loadMessages, []);

  return (
        <GiftedChat
          messages={messages}
          onSend={updateMessages}
          user={user}
        />
  );
};
