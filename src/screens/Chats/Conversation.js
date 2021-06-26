import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from '../../firebase/FirebaseSvc';
import { getError, onSuccess, onFailure, } from '../../services/RegistrationHandlers'

export function Conversation(props) {
  const [user, setUser] = useState({});
  const id = props.route.params.matchID;
  // const user = {
  //   name: cUser.displayName,
  //   email: cUser.email,
  //   avatar: cUser.photoURL,
  //   _id: firebaseSvc.uid
  // };
  // const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);

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

    await firebaseSvc.messageRefRetrieve(id ,messageArray => {
      setMessages(messageArray);
      // setIsLoaded(true);
    });
    const user = await firebaseSvc
                            .getCurrentUserCollection(
                                (snapshot) => snapshot.val(),
                                getError(props))
                            .then(x => x)
                            .catch(getError(props));
    setUser(user);
    // await props.fetchUserData();
    if (user === null) {
        props.navigation.goBack();
    }
    //TODO: Use Promise.all for cleaner async code
  };

  const updateMessages = (messageList) => {
    firebaseSvc.send(id, messageList);
  };

  useEffect(() => {
    loadChat();
    return () => {
      console.log('clean up!');
      firebaseSvc.messageRefOff(id);
      setMessages([]);
      // setIsLoaded(false);
    }
  }, []);

  return (
        <GiftedChat
          messages={messages}
          onSend={updateMessages}
          user={user}
          showUserAvatar={true}
        />
  );
};