import React, {useEffect, useState} from 'react'
import {View, SafeAreaView, Text, FlatList} from 'react-native'
import { Avatar, ListItem, SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserData, clearData } from '../../redux/actions/actions'
import { renderFooter } from '../../components/renderFooter'
import renderSeparator from '../../components/renderSeparator'
import renderHeader from '../../components/renderHeader'
import firebaseSvc from '../../firebase/FirebaseSvc'

function MatchesHistory (props) {
    const [data, setData] = useState([]);
    const [matchIDs, setMatchIDs] = useState({});
    const [loading, setLoading]= useState(true);
    
    async function loadAsync() {
      await firebaseSvc
            .getMatchIDs(
              snapshot => {
                let ids = snapshot.val();
                for(let key in ids) {
                  if(!(key in matchIDs)) {
                    matchIDs[key] = true;
                    setData(data.concat({...ids[key], matchID: key}))
                  }
                }
              },
              err => {console.log(err.message)}
            )
        setLoading(false);
    }

    useEffect(() => {
        loadAsync();
    }, [])

    const pickImage = item => item.otherUserData.avatar == null || item.otherUserData.avatar == ""
                                ? 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/avatar%2Fempty_avatar.png?alt=media&token=c36c29b3-d90b-481f-a9d9-24bc73619ddc'
                                : item.otherUserData.avatar;
    
    return (
      <SafeAreaView>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={{borderBottomWidth:5, height: 160}}
              key={index}
              onPress={() => props.navigation.navigate('Conversation', {matchID: item.matchID})}
              roundAvatar>
                <Avatar size="large" source={{uri:pickImage(item)}}/>
                <ListItem.Content>
                  <ListItem.Title>{`${item.otherUserData.name}, ${item.industryPreference} industry`}</ListItem.Title>
                  <ListItem.Subtitle>{`${item.lastMessage == '' ? 'Click here to start a chat!': item.lastMessage}`}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={item => item.datetime}
            ItemSeparatorComponent={renderSeparator}
            // ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter(loading)}
            onEndReachedThreshold={50}
          />
      </SafeAreaView>
    );
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(MatchesHistory);
// import React, { useState, useEffect } from 'react'
// import { SafeAreaView, FlatList, View, TouchableHighlight } from 'react-native';
// import { GiftedChat } from 'react-native-gifted-chat'
// import firebaseSvc from '../firebase/FirebaseSvc';
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
// import { fetchAuthUser, fetchUserData } from '../redux/actions/actions'
// import { renderFooter } from '../components/renderFooter'
// import renderSeparator from '../components/renderSeparator'
// import renderHeader from '../components/renderHeader'

// export function ChatRoom(props) {
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedMatchID, setSelectedMatchID] = useState('');

//   const conversationItem = ({item, index, separators}) => {
//     <View>
//       <TouchableHighlight onPress={props.navigation.navigate('Conversation', {matchID: selectedMatchID})}>
//         <Text>{match.name}</Text>
//         <Text>{match.lastMessage}</Text>
//       </TouchableHighlight>
//     </View>
//   };

//   async function loadAsync() {
//     try {
//       await props.fetchUserData();
//       const user = props.currentUserData;
//       setMatches(user.match_list);
//       setLoading(false);
//     } catch (err) {
//       console.log(err);
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadAsync();
//     // return () => {
//     //   cleanup
//     // }
//   }, [])

//   return (
//     <SafeAreaView>
//       <FlatList
//         data={matches}
//         renderItem={conversationItem}
//         keyExtractor={item => item.id}
//         ItemSeparatorComponent={renderSeparator}
//         // ListHeaderComponent={renderHeader}
//         ListFooterComponent={renderFooter({})}
//         onEndReachedThreshold={50}
//       />
//     </SafeAreaView>
//   );
// };
// const mapStateToProps = (store) => ({
//   currentUserData: store.userState.currentUserData,
//   loggedIn: store.userState.loggedIn,
//   isAdmin: store.userState.isAdmin
// })
// const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
// export default connect(mapStateToProps, mapDispatchProps)(ChatRoom);