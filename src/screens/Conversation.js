import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from '../firebase/FirebaseSvc';

export function Conversation(props) {
  const cUser = firebaseSvc.currentUser();
  const user = {
    name: cUser.displayName,
    email: cUser.email,
    avatar: cUser.photoURL,
    _id: firebaseSvc.uid
  };
  // const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);

  const loadMessages = () => {
    //TODO: Find efficient way to incorporate child_added listener
    // firebaseSvc.messageRefOn(message => {
    //   if (isLoaded) {
    //     console.log('come on');
    //     let newMsgs = [...messages, message];
    //     console.log(newMsgs);
    //     setMessages(newMsgs);
    //     // setMessages(GiftedChat.append(messages, message));
    //   }
    // });
    firebaseSvc.messageRefRetrieve(messageArray => {
      setMessages(messageArray);
      // setIsLoaded(true);
    });
    return () => {
      console.log('clean up!');
      firebaseSvc.messageRefOff();
      setMessages([]);
      // setIsLoaded(false);
    }
  };

  const updateMessages = (messageList) => {
    firebaseSvc.send(messageList);
  };

  useEffect(loadMessages, []);

  return (
        <GiftedChat
          messages={messages}
          onSend={updateMessages}
          user={user}
          showUserAvatar={true}
        />
  );
};