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

/**
 * Page to Show previous Matches
 * 
 * @param {*} props Props from previous screen
 * @returns MatchesHistory Render Method 
 */
 function Pending (props, {navigation}) {
    const [data, setData] = useState([]);
    const [matchIDs, setMatchIDs] = useState({});
    const [selectedID, setSelectedID] = useState(null)

    function renderPendingContent(item, index) {
      const dateStringMaker = (date) => {
          return date.slice(0, 10)
      }
      const timeStringMaker = (date) => {
          return date.slice(16, 21)
      }
      return (
          <ListItem
                        containerStyle={{borderBottomWidth:5, height: 110}}
                        key={props.index} 
                        roundAvatar>
                          <View style={{flexDirection: 'column', borderColor: '#000', paddingRight: '2.5%',borderRightWidth: 2}}>
                          <ListItem.Subtitle style={{fontWeight: '500'}}>{`${dateStringMaker(item.datetime)}`}</ListItem.Subtitle>
                          <ListItem.Subtitle style={{fontWeight: '300'}}>{`${timeStringMaker(item.datetime)}`}</ListItem.Subtitle>
                          </View>
                          <ListItem.Content>
                            <ListItem.Title style={{fontWeight: '500'}}>{`${INDUSTRY_CODES[item.otherUserIndustry]} Industry`}</ListItem.Title>
                            <ListItem.Title style={{fontWeight: '300'}}>{`${item.cuisinePreference} Cuisine`}</ListItem.Title>
                          </ListItem.Content>
                          <View style={{flexDirection: 'column'}}>

                            {!matchIDs[item.matchID] && 
                            <TouchableOpacity onPress={async() => 
                              {
                                let res = await firebaseSvc.matchConfirm(item)
                                let replacementSelectedID = Math.random()
                                switch(res) {
                                  case(FINAL_SUCCESS):
                                  // Logic for modal popping up
                                  setSelectedID(replacementSelectedID)
                                  props.navigation.navigate('Matched')
                                  break;

                                  case(CONFIRM_SUCCESS):
                                  matchIDs[item.matchID] = true
                                  setSelectedID(replacementSelectedID)
                                  break;

                                  case(FINAL_FAIL):
                                  await firebaseSvc.matchDecline(item)
                                  // logic for modal informing of inability to match and deletion
                                  setSelectedID(replacementSelectedID)
                                  break;

                                  case(CONFIRM_FAIL):
                                  await firebaseSvc.matchDecline(item)
                                  // logic for modal informing of inability to match and deletion
                                  setSelectedID(replacementSelectedID)
                                  break;
                                }    
                              }}>
                            <ListItem.Subtitle style={{color: 'green'}}>{`Accept`}</ListItem.Subtitle>
                            </TouchableOpacity>}
                            
                            {!matchIDs[item.matchID] &&
                            <TouchableOpacity onPress={() => {
                              let replacementSelectedID = Math.random();
                              console.log('Declined')
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
                                let unacceptRes = await firebaseSvc.matchUnaccept(item)
                                let replacementSelectedID = Math.random()
                                switch(unacceptRes) {
                                  case(UNACCEPT_SUCCESS):
                                  matchIDs[item.matchID] = false;                    
                                  console.log(UNACCEPT_SUCCESS)
                                  setSelectedID(replacementSelectedID)
                                  break

                                  case(UNACCEPT_FAIL):
                                  console.log(UNACCEPT_FAIL)
                                  firebaseSvc.matchDecline(item)
                                  setSelectedID(replacementSelectedID) 
                                  break
                                } 
                              }}>
                            <ListItem.Subtitle style={{color: 'red'}}>{`Unaccept`}</ListItem.Subtitle>
                            </TouchableOpacity>
                            }
                          </View>
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
                if (ids == null) {
                  setData([])
                  setMatchIDs({})
                } else  {
                  // console.log(ids, 'ids')
                  let newData = [];
                  for(let [key, value] of Object.entries(ids)) {
                    if(!(key in matchIDs)) {
                      matchIDs[key] = await firebaseSvc.obtainStatusOfPendingMatch(key);
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
    },[])

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
            renderItem={({ item, index }) => renderPendingContent(item, index)}
            keyExtractor={item => item.datetime}
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