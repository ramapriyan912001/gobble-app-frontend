import React, {useEffect, useState} from 'react'
import {View, SafeAreaView, Text, FlatList, Alert, TouchableOpacity} from 'react-native'
import { Avatar, ListItem, SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserData, clearData } from '../redux/actions/actions'
import { renderFooter } from '../components/renderFooter'
import renderSeparator from '../components/renderSeparator'
import renderHeader from '../components/renderHeader'
import firebaseSvc from '../firebase/FirebaseSvc'
import { FOOD_IMAGES_URIs } from '../constants/objects'
import { INDUSTRY_CODES } from '../constants/objects'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { blockAndUnblockAlert } from '../constants/alerts'
import {UNBLOCK_SUCCESS } from '../constants/results'

/**
 * Page to Show previous Matches
 * 
 * @param {*} props Props from previous screen
 * @returns MatchesHistory Render Method 
 */
function BlockedUsers (props, {navigation}) {
    const [data, setData] = useState([]);
    const [selectedID, setSelectedID] = useState(null)
    // const [loading, setLoading]= useState(true);
    const dateStringMaker = (date) => {
      return date.slice(0, 21)
    }
    /**
     * Load Data Asynchronously
     */
    async function loadAsync() {
      await firebaseSvc
            .getBlockedUsers(
              async(snapshot) => {
                let ids = snapshot.val();
                if (ids == null) {
                  setData([])
                } else  {
                  // console.log(ids, 'ids')
                  let newData = [];
                  for(let [key, value] of Object.entries(ids)) {
                    newData = newData.concat(value);
                  }
                  setData(newData);
                }
              },
              x => x,
              err => {console.log('Error Loading Matched IDs:',err.message)}
            )
        // setLoading(false);
    }

    useEffect(() => {
        loadAsync();
        return () => {
          console.log('matchHistory clean up!');
          firebaseSvc.matchIDsOff();
        }
    }, [])

    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', async() => {
          await loadAsync();
      })
      return unsubscribe;
    }, [navigation])

    const unblockAlert = (text, item) =>
        Alert.alert(
            text, 'Your chat history will be lost forever.',
        [
            {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
            },
            { text: "Yes", onPress: async() => {
                let res = await firebaseSvc.unblockUser(item.id)
                if(res == UNBLOCK_SUCCESS) {
                    setSelectedID(Math.random())
                } else {
                    Alert.alert("Sorry, user could not be unblocked.", "Try again later.")
                }
            }
            }
        ]
        )
    if(data.length != 0) {
      return (
        <SafeAreaView>
            <FlatList
              data={data}
              extraData={selectedID}
              renderItem={({ item, index }) => (
                <ListItem
                containerStyle={{borderBottomWidth:5, height: 110}}
                key={index} 
                roundAvatar>
                  <Avatar avatarStyle={{borderRadius: 120}} size="large" source={{uri:item.avatar}}/>
                  <ListItem.Content>
                    <ListItem.Title style={{fontWeight: 'bold'}}>{`${item.name}`}</ListItem.Title>
                  </ListItem.Content>
                  <TouchableOpacity onPress={() => {
                    let text = `Are you sure you wish to unblock ${item.name}?`
                      unblockAlert(text, item)
                  }}>
                      <MaterialCommunityIcons name="account-off-outline" size={28}/>
                  </TouchableOpacity>
                </ListItem>
              )}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={renderSeparator}
              // ListHeaderComponent={renderHeader}
              // ListFooterComponent={renderFooter(loading)}
              onEndReachedThreshold={50}
            />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
          <Text style={{alignSelf: 'center'}}>You have no blocked users!</Text>
        </SafeAreaView>
      )
    }
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(BlockedUsers);