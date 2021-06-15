
import React, { useState, useEffect } from 'react'
import { SafeAreaView, FlatList, View, TouchableHighlight } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from '../firebase/FirebaseSvc';
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
// import { fetchUser, clearData } from '../redux/actions/actions'

//Haven't worked on this yet, change to a FlatList of all conversations under current user uid

// export function ChatRoom(props) {
//   const user = props.fetchUser();
  
//   const [convoID, setConvoID] = useState('');

//   const conversationItem = ({conversation, index, separators}) => {
//     <View>
//       <TouchableHighlight onPress={props.navigation.navigate('Conversation', {conversationID: convoID})}>
//         <Text>{conversation}</Text>
//       </TouchableHighlight>
//     </View>
//   };

//   return (
//     <SafeAreaView>
//       <FlatList
//         data={firebaseSvc.getUserConversations()}
//         renderItem={conversationItem}
//         keyExtractor={item => item.id}
//       />
//     </SafeAreaView>
//   );
// };
// const mapStateToProps = (store) => ({
//   currentUser: store.userState.currentUser,
//   loggedIn: store.userState.currentUser,
//   isAdmin: store.userState.isAdmin
// })
// const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);
// export default connect(mapStateToProps, mapDispatchProps)(ChatRoom);
export function ChatRoom(props) {
  const cUser = firebaseSvc.currentUser();
  const user = {
    name: cUser.displayName,
    email: cUser.email,
    avatar: cUser.photoURL,
    _id: firebaseSvc.uid
  };
  const [isLoaded, setIsLoaded] = useState(false);
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
      setIsLoaded(true);
    });
    return () => {
      console.log('clean up!');
      firebaseSvc.messageRefOff();
      setMessages([]);
      setIsLoaded(false);
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
