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
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';

/**
 * List of all matched people/conversations
 * 
 * @param {*} props Props from previous screen
 * @returns ChatRoom Render Method 
 */
function ChatRoom (props, {navigation}) {
    const [data, setData] = useState([]);
    const [userIDs, setUserIDs] = useState({});
    const [loading, setLoading]= useState(true);
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const [selectedID, setSelectedID] = useState(null)
    
    /**
     * Load Chats asynchronously
     */
    async function loadAsync() {
      await firebaseSvc
            .getChats(
              snapshot => {
                const chats = snapshot.val();
                if (chats == null) {
                  setData([])
                } else {
                  let newData = [];
                  for(let [key, value] of Object.entries(chats)) {
                    if(!(key in userIDs)) {
                      userIDs[key] = true;
                    }
                    newData = newData.concat(value.metadata);
                  }
                  console.log(newData)
                  setData(newData);
                } 
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

    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', async() => {
        console.log('focus')
        await loadAsync();
        setSelectedID(Math.random())
      return unsubscribe
      })
  }, [navigation])

    return (
      <SafeAreaView style={themes.containerTheme(isLight)}>
          <FlatList
            data={data}
            style={themes.containerTheme(isLight)}
            extraData={selectedID}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={[{borderBottomWidth:5, height: 110}, themes.containerTheme(isLight)]}
              key={index}
              onPress={() => props.navigation.navigate('Conversation', {metadata: item})}
              roundAvatar>
                <Avatar size="large" avatarStyle={{borderRadius: 120}} source={{uri:item.otherUserAvatar}}/>
                <ListItem.Content>
                  <ListItem.Title style={themes.textTheme(isLight)}>{`${item.name}, ${INDUSTRY_CODES[item.industry]} industry`}</ListItem.Title>
                  <ListItem.Subtitle style={themes.textTheme(isLight)}>{`${item.lastMessage == '' ? 'Click here to start a chat!': item.lastMessage}`}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={item => item.matchDateTime}
            ItemSeparatorComponent={renderSeparator}
            // ListHeaderComponent={renderHeader}
            // ListFooterComponent={renderFooter(loading)}
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