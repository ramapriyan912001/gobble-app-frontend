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
import { CONFIRM_SUCCESS, FINAL_FAIL, FINAL_SUCCESS, CONFIRM_FAIL, UNACCEPT_SUCCESS, UNACCEPT_FAIL } from '../../constants/results'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';
import { Alert } from 'react-native'
import Loader from 'react-native-three-dots-loader'
import Animated from 'react-native-reanimated'

/**
 * Page to Show previous Matches
 * 
 * @param {*} props Props from previous screen
 * @returns MatchesHistory Render Method 
 */
 function Pending (props, {navigation}) {
    const [data, setData] = useState([]);
    const [matchIDs, setMatchIDs] = useState({});
    const [selectedID, setSelectedID] = useState(null);
    const [loadingStates, setLoadingStates] = useState({})
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';

    function renderPendingContent(item, index) {
      const dateStringMaker = (date) => {
          return date.slice(0, 10)
      }
      function getState(item) {
        let id = item['matchID']
        return loadingStates[id]
      }
      const timeStringMaker = (date) => {
          return date.slice(16, 21)
      }

      const failureAcceptAction = async(item) => {
        Alert.alert('Unfortunately, there was an issue.', 'Your match has been cancelled.')
        await firebaseSvc.matchDecline(item)
        // logic for modal informing of inability to match and deletion
        let states = loadingStates
        states[item.matchID] = false;
        setLoadingStates(states)
        setSelectedID(replacementSelectedID)
      }

      const successAcceptAction = (item) => {
        let states = loadingStates
        states[item.matchID] = false;
        setLoadingStates(states)
      }
      return (
          <ListItem
                        containerStyle={[{borderBottomWidth:5, height: 110}, themes.containerTheme(isLight)]}
                        key={props.index} 
                        roundAvatar>
                          <View style={{flexDirection: 'column', borderColor: themes.oppositeTheme(isLight), paddingRight: '2.5%',borderRightWidth: 2}}>
                          <ListItem.Subtitle style={[{fontWeight: '500'}, themes.textTheme(isLight)]}>{`${dateStringMaker(item.datetime)}`}</ListItem.Subtitle>
                          <ListItem.Subtitle style={[{fontWeight: '300'}, themes.textTheme(isLight)]}>{`${timeStringMaker(item.datetime)}`}</ListItem.Subtitle>
                          </View>
                          <ListItem.Content>
                            <ListItem.Title style={[{fontWeight: '500'}, themes.textTheme(isLight)]}>{`${INDUSTRY_CODES[item.otherUserIndustry]} Industry`}</ListItem.Title>
                            <ListItem.Title style={[{fontWeight: '300'}, themes.textTheme(isLight)]}>{`${item.cuisinePreference} Cuisine`}</ListItem.Title>
                          </ListItem.Content>
                          {!loadingStates[item.matchID] &&
                          <View style={{flexDirection: 'column'}}>
                            {!matchIDs[item.matchID] && 
                            <TouchableOpacity onPress={async() => 
                              {
                                let states = loadingStates
                                states[item.matchID] = true;
                                let replacementSelectedID = Math.random()
                                setLoadingStates(states)
                                setSelectedID(replacementSelectedID)
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                                let res = await firebaseSvc.matchConfirm(item)
                                replacementSelectedID = Math.random()
                                switch(res) {
                                  case(FINAL_SUCCESS):
                                  // Logic for modal popping up
                                  successAcceptAction(item)
                                  setSelectedID(replacementSelectedID)
                                  Alert.alert('Yay! Your Gobble is set!', 'Happy Gobbling!')
                                  props.navigation.navigate('Matched')
                                  break;

                                  case(CONFIRM_SUCCESS):
                                  successAcceptAction(item)
                                  matchIDs[item.matchID] = true
                                  setSelectedID(replacementSelectedID)
                                  break;

                                  case(FINAL_FAIL):
                                  failureAcceptAction(item);
                                  break;

                                  case(CONFIRM_FAIL):
                                  failureAcceptAction(item);
                                  break;
                                }    
                              }}>
                            <ListItem.Subtitle style={{color: 'green'}}>{`Accept`}</ListItem.Subtitle>
                            </TouchableOpacity>}
                            {!matchIDs[item.matchID] &&
                            <TouchableOpacity onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                              let states = loadingStates
                              states[item.matchID] = true;
                              setLoadingStates(states)
                              let replacementSelectedID = Math.random()
                              setSelectedID(replacementSelectedID)
                              replacementSelectedID = Math.random();
                              console.log('Confirmed')
                              firebaseSvc.matchDecline(item)
                              setSelectedID(replacementSelectedID) 
                            }}>
                            <ListItem.Subtitle style={{color: 'red'}}>{`Decline`}</ListItem.Subtitle>
                            </TouchableOpacity>}
                            {matchIDs[item.matchID] &&
                            <ListItem.Subtitle style={{color: 'green'}}>{`Accepted!`}</ListItem.Subtitle>
                            }
                            {matchIDs[item.matchID] &&
                            <TouchableOpacity onPress={async() => 
                              {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                                let states = loadingStates
                                states[item.matchID] = true;
                                let replacementSelectedID = Math.random()
                                setLoadingStates(states)
                                setSelectedID(replacementSelectedID)
                                let unacceptRes = await firebaseSvc.matchUnaccept(item)
                                replacementSelectedID = Math.random()
                                switch(unacceptRes) {
                                  case(UNACCEPT_SUCCESS):
                                  matchIDs[item.matchID] = false;                    
                                  console.log(UNACCEPT_SUCCESS)
                                  states = loadingStates
                                  states[item.matchID] = false;
                                  setLoadingStates(states)
                                  setSelectedID(replacementSelectedID)
                                  break

                                  case(UNACCEPT_FAIL):
                                  console.log(UNACCEPT_FAIL)
                                  firebaseSvc.matchDecline(item)
                                  states = loadingStates
                                  states[item.matchID] = false;
                                  setLoadingStates(states)
                                  setSelectedID(replacementSelectedID) 
                                  break
                                } 
                              }}>
                            <ListItem.Subtitle style={{color: 'red'}}>{`Unaccept`}</ListItem.Subtitle>
                            </TouchableOpacity>
                            }
                          </View>
                          }
                          {loadingStates[item.matchID] &&
                            <View style={{flexDirection: 'column'}}>
                              <Loader useNativeDriver={true}/>
                            </View>
                          }
                        </ListItem>
          )
  }
    /**
     * Load Data Asynchronously
     */
    async function loadAsync() {
      await firebaseSvc
            .getPendingMatchIDs(
              async(snapshot) => {
                let ids = snapshot.val();
                let states = {};
                if (ids == null) {
                  setData([])
                  setMatchIDs({})
                  setLoadingStates({})
                } else  {
                  let newData = [];
                  for(let [key, value] of Object.entries(ids)) {
                    states[key] = false;
                    if(!(key in matchIDs)) {
                      matchIDs[key] = await firebaseSvc.obtainStatusOfPendingMatch(key, value.pendingTime);
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
                  setLoadingStates(states)
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
          console.log('pendingMatchID clean up!');
          firebaseSvc.pendingMatchIDsOff();
        }
    }, [])

    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', async() => {
          await loadAsync();
      })
      
      return unsubscribe;
    }, [navigation])
    
    return (
      <SafeAreaView>
          <FlatList
            data={data}
            extraData={selectedID}
            style={themes.containerTheme(isLight)}
            renderItem={({ item, index }) => renderPendingContent(item, index)}
            keyExtractor={item => item.matchID}
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
export default connect(mapStateToProps, mapDispatchProps)(Pending);