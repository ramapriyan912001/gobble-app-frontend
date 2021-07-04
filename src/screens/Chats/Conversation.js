import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from '../../firebase/FirebaseSvc';
import { getError, onSuccess, onFailure, } from '../../services/RegistrationHandlers'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';

/**
 * Conversation Page between two matched users
 * 
 * @param {*} props Props from previous screen
 * @returns Conversation Render Method
 */
export function Conversation(props) {
  const metadata = props.route.params.metadata;
  const [user, setUser] = useState(metadata);
  const id = metadata.conversation;
  const [messages, setMessages] = useState([]);
  const colorScheme = useColorScheme();
  const isLight = colorScheme === 'light';

  /**
   * Asynchronously load message listeners
   */
  const loadChat = async () => {
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

    await firebaseSvc.messageRefRetrieve(id, messageArray => {
      setMessages(messageArray);
      // setIsLoaded(true);
    });
    // await props.fetchUserData();
    if (user == null) {
        props.navigation.goBack();
    }
    //TODO: Use Promise.all for cleaner async code
  };

  /**
   * Function to update chat messages when new message is sent
   * 
   * @param {*} messageList List of all messages in chat
   */
  const updateMessages = (messageList) => {
    firebaseSvc.send(id, metadata.otherUserId, messageList);
  };

  const bubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: themes.containerTheme(!isLight)
      }}
      textStyle={{
        left:themes.textTheme(!isLight)
      }}
      />
  );

  useEffect(() => {
    loadChat();
    return () => {
      console.log('convo clean up!');
      firebaseSvc.messageRefOff(id);
      setMessages([]);
      // setIsLoaded(false);
    }
  }, []);

  return (
        <GiftedChat
          messagesContainerStyle={themes.containerTheme(isLight)}
          messages={messages}
          onSend={updateMessages}
          user={user}
          showUserAvatar={true}
          renderBubble={bubble}
        />
  );
};