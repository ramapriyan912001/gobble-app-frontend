import React, {useEffect, useState} from 'react'
import {Platform, SafeAreaView, Text, FlatList, Alert, TouchableOpacity} from 'react-native'
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
import themes from '../styles/Themes';
import { useColorScheme } from 'react-native-appearance';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';

/**
 * Page to Show Blocked Users
 * 
 * @param {*} props Props from previous screen
 * @returns BlockedUsers Render Method 
 */
export default function BlockedUsers (props, {navigation}) {
    const [data, setData] = useState([]);
    const [selectedID, setSelectedID] = useState(null);
    const [currentID, setCurrentID] = useState(firebaseSvc.uid);
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const drawerTopMargin = Platform.OS === 'ios' ? '-87%' : '-70%';
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
          console.log('Blocked users clean up!');
          firebaseSvc.blockedUsersOff(currentID);
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
        <SafeAreaView style={[{height: '100%'}, themes.containerTheme(isLight)]}>
            <FlatList
              data={data}
              extraData={selectedID}
              renderItem={({ item, index }) => (
                <ListItem
                containerStyle={{borderBottomWidth:5, height: 110, backgroundColor:themes.oppositeTheme(!isLight)}}
                key={index} 
                roundAvatar>
                  <Avatar avatarStyle={{borderRadius: 120}} size="large" source={{uri:item.avatar}}/>
                  <ListItem.Content>
                    <ListItem.Title style={{fontWeight: 'bold', color:themes.oppositeTheme(isLight)}}>{`${item.name}`}</ListItem.Title>
                  </ListItem.Content>
                  <TouchableOpacity onPress={() => {
                    let text = `Are you sure you wish to unblock ${item.name}?`
                      unblockAlert(text, item)
                  }}>
                      <MaterialCommunityIcons color={themes.oppositeTheme(isLight)} name="account-off-outline" size={28}/>
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
        <SafeAreaView style={[{flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}, themes.containerTheme(isLight)]}>
          <Text style={[{alignSelf: 'center', fontWeight:'bold'}, themes.textTheme(isLight)]}>You have no blocked users!</Text>
        </SafeAreaView>
      )
    }
}