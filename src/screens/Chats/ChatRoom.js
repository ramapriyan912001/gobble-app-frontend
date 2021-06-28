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
import { INDUSTRY_CODES } from '../../constants/objects'

/**
 * List of all matched people/conversations
 * 
 * @param {*} props Props from previous screen
 * @returns ChatRoom Render Method 
 */
function ChatRoom (props) {
    const [data, setData] = useState([]);
    const [userIDs, setUserIDs] = useState({});
    const [loading, setLoading]= useState(true);
    
    /**
     * Load Chats asynchronously
     */
    async function loadAsync() {
      await firebaseSvc
            .getChats(
              snapshot => {
                const chats = snapshot.val();
                let newData = [];
                for(let [key, value] of Object.entries(chats)) {
                  if(!(key in userIDs)) {
                    userIDs[key] = true;
                  }
                  newData = newData.concat(value.metadata);
                }
                setData(newData);
              },
              err => {console.log(err.message)}
            )
        setLoading(false);
    }

    useEffect(() => {
        loadAsync();
        return () => {
          console.log('chatroom clean up!');
          firebaseSvc.chatsOff();
        }
    }, [])

    return (
      <SafeAreaView>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={{borderBottomWidth:5, height: 160}}
              key={index}
              onPress={() => props.navigation.navigate('Conversation', {metadata: item})}
              roundAvatar>
                <Avatar size="large" source={{uri:item.otherUserAvatar}}/>
                <ListItem.Content>
                  <ListItem.Title>{`${item.name}, ${INDUSTRY_CODES[item.industry]} industry`}</ListItem.Title>
                  <ListItem.Subtitle>{`${item.lastMessage == '' ? 'Click here to start a chat!': item.lastMessage}`}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={item => item.matchDateTime}
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
export default connect(mapStateToProps, mapDispatchProps)(ChatRoom);