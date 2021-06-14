
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from '../firebase/FirebaseSvc';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, clearData } from '../redux/actions/index'

//Haven't worked on this yet, need to add API calls in backend and over here

export function ChatRoom() {
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
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(ChatRoom);