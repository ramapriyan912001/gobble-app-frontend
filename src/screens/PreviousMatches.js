import React, {useEffect, useState} from 'react'
import {View, SafeAreaView, Text, FlatList} from 'react-native'
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

/**
 * Page to Show previous Matches
 * 
 * @param {*} props Props from previous screen
 * @returns MatchesHistory Render Method 
 */
function PreviousMatches (props, {navigation}) {
    const [data, setData] = useState([]);
    const [matchIDs, setMatchIDs] = useState({});
    const [user, setOtherUser] = useState({})
    // const [loading, setLoading]= useState(true);
    
    /**
     * Load Data Asynchronously
     */
    async function loadAsync() {
      setOtherUser(props.route.params.otherUser)
        firebaseSvc
            .getMatchIDs(
              async(snapshot) => {
                let ids = snapshot.val();
                if (ids == null) {
                  //Do Nothing
                } else  {
                  // console.log(ids, 'ids')
                  let newData = [];
                  for(let [key, value] of Object.entries(ids)) {
                    if(!(key in matchIDs)) {
                      matchIDs[key] = true;
                    }
                    let details = ids[key]
                    let otherUserId = details.otherUserId
                    let avatar, industry;

                    firebaseSvc
                          .avatarRef(details.otherUserId)
                          .once("value")
                          .then(subsnap => {details = {...details, otherUserAvatar: subsnap.val()}})
                          .catch(err => console.log('Error Loading Avatar:',err.message));
                    firebaseSvc
                          .industryRef(details.otherUserId)
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
          // console.log('matchHistory clean up!');
          firebaseSvc.matchIDsOff();
        }
    }, [data, matchIDs])

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
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={{borderBottomWidth:5, height: 120}}
              key={index} 
              roundAvatar>
                <Avatar avatarStyle={{borderRadius: 120}} size="large" source={{uri:item.otherUserAvatar}}/>
                <ListItem.Content>
                  <ListItem.Title>{`${item.otherUserName}, ${INDUSTRY_CODES[item.otherUserIndustry]} industry`}</ListItem.Title>
                  <ListItem.Subtitle>{`${item.cuisinePreference} cuisine, ${item.datetime}`}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
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
export default connect(mapStateToProps, mapDispatchProps)(PreviousMatches);