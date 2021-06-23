
import React, { useState, useEffect } from 'react'
import { SafeAreaView, FlatList, View, TouchableHighlight } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from '../firebase/FirebaseSvc';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../redux/actions/actions'
import { renderFooter } from '../components/renderFooter'
import renderSeparator from '../components/renderSeparator'
import renderHeader from '../components/renderHeader'

export function ChatRoom(props) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatchID, setSelectedMatchID] = useState('');

  const conversationItem = ({item, index, separators}) => {
    <View>
      <TouchableHighlight onPress={props.navigation.navigate('Conversation', {matchID: selectedMatchID})}>
        <Text>{match.name}</Text>
        <Text>{match.lastMessage}</Text>
      </TouchableHighlight>
    </View>
  };

  async function loadAsync() {
    try {
      await props.fetchUserData();
      const user = props.currentUserData;
      setMatches(user.match_list);
      setLoading(false);
    } catch (err) {
      console.warn(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAsync();
    // return () => {
    //   cleanup
    // }
  }, [])

  return (
    <SafeAreaView>
      <FlatList
        data={matches}
        renderItem={conversationItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={renderSeparator}
        // ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter({})}
        onEndReachedThreshold={50}
      />
    </SafeAreaView>
  );
};
const mapStateToProps = (store) => ({
  currentUserData: store.userState.currentUserData,
  loggedIn: store.userState.loggedIn,
  isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(ChatRoom);