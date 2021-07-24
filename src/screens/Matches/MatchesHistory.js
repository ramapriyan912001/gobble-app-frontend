import React, {useEffect, useState} from 'react'
import {View, SafeAreaView, Text, FlatList, TouchableOpacity} from 'react-native'
import { Avatar, ListItem, SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserData, clearData } from '../../redux/actions/actions'
import { renderFooter } from '../../components/renderFooter'
import renderSeparator from '../../components/renderSeparator'
import renderHeader from '../../components/renderHeader'
import firebaseSvc from '../../firebase/FirebaseSvc'
import { FOOD_IMAGES_URIs } from '../../constants/objects'
import { INDUSTRY_CODES } from '../../constants/objects'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

/**
 * Page to Show previous Matches
 * 
 * @param {*} props Props from previous screen
 * @returns MatchesHistory Render Method 
 */
function MatchesHistory (props, {navigation}) {
    const [data, setData] = useState([]);
    const [matchIDs, setMatchIDs] = useState({});
    const [selectedID, setSelectedID] = useState(null);
    const [currentID, setCurrentID] = useState(firebaseSvc.uid);
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';

    // const [loading, setLoading]= useState(true);
    const dateStringMaker = (date) => {
      return date.slice(0, 21)
    }
    /**
     * Load Data Asynchronously
     */
    async function loadAsync() {
      await firebaseSvc
            .getMatchIDs(
              async(snapshot) => {
                let ids = snapshot.val();
                if (ids == null) {
                  setData([])
                  setMatchIDs({})
                } else  {
                  // console.log(ids, 'ids')
                  let newData = [];
                  for(let [key, value] of Object.entries(ids)) {
                    if(!(key in matchIDs)) {
                      matchIDs[key] = true;
                    }
                    let details = ids[key]
                    let otherUserId = details.otherUserId
                    await firebaseSvc
                          .avatarRef(otherUserId)
                          .once("value")
                          .then(subsnap => {details = {...details, otherUserAvatar: subsnap.val()}})
                          .catch(err => console.log('Error Loading Avatar:',err.message));
                    await firebaseSvc
                          .industryRef(otherUserId)
                          .once("value")
                          .then(subsnap => {details = {...details, otherUserIndustry: subsnap.val()}})
                          .catch(err => console.log('Error Loading Avatar:',err.message));
                    newData = newData.concat(details);
                  }
                  newData.sort(function (a, b) {
                    let x = new Date(a.datetime)
                    let y = new Date(b.datetime)
                    return x <= y ? -1 : 1
                  });
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
          firebaseSvc.matchIDsOff(currentID);
        }
    }, [])

    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', async() => {
          await loadAsync();
          setSelectedID(Math.random())
      })
      return unsubscribe;
    }, [navigation])
    if(data.length != 0) {
      return (
        <SafeAreaView style={[{height: '100%'},themes.containerTheme(isLight)]}>
          <FlatList
              data={data}
              style={themes.containerTheme(isLight)}
              extraData={selectedID}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                onPress={() => props.navigation.navigate('Restaurants', {item: item})}>
                  <ListItem
                  containerStyle={[{borderBottomWidth:3,  height: 110}, themes.containerTheme(isLight)]}
                  key={index} 
                  roundAvatar>
                    <Avatar avatarStyle={{borderRadius: 120}} size="large" source={{uri:item.otherUserAvatar}}/>
                    <ListItem.Content>
                      <ListItem.Title style={[{fontWeight: 'bold'}, themes.textTheme(isLight)]}>{`${item.otherUserName}, ${INDUSTRY_CODES[item.otherUserIndustry]} industry`}</ListItem.Title>
                      <ListItem.Subtitle style={themes.textTheme(isLight)}>{`${item.cuisinePreference} cuisine`}</ListItem.Subtitle>
                      <ListItem.Subtitle style={themes.textTheme(isLight)}>{`${dateStringMaker(item.datetime)}`}</ListItem.Subtitle>
                    </ListItem.Content>
                    <MaterialIcons size={28} name='restaurant-menu'></MaterialIcons>
                  </ListItem>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.matchID}
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
          <Text style={[{alignSelf: 'center', fontWeight:'bold'}, themes.textTheme(isLight)]}>You have no matches at the moment!</Text>
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
export default connect(mapStateToProps, mapDispatchProps)(MatchesHistory);