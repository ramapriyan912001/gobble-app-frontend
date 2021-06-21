
import React, { useState, useEffect } from 'react'
import { SafeAreaView, FlatList, View, TouchableHighlight } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from '../firebase/FirebaseSvc';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../redux/actions/actions'


export function ChatRoom(props) {
  const matches = fetchUserData().match_list;
  
  const [selectedMatchID, setSelectedMatchID] = useState('');

  const conversationItem = ({match, index, separators}) => {
    <View>
      <TouchableHighlight onPress={props.navigation.navigate('Conversation', {matchID: selectedMatchID})}>
        <Text>{match.name}</Text>
        <Text>{match.lastMessage}</Text>
      </TouchableHighlight>
    </View>
  };

  return (
    <SafeAreaView>
      <FlatList
        data={firebaseSvc.getMatchList()}
        renderItem={conversationItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  loggedIn: store.userState.currentUser,
  isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(ChatRoom);