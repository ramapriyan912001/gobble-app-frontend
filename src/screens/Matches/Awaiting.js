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

/**
 * Page to Load the Pending Matches Screen
 * 
 * @param {*} props Props from previous screen
 * @returns Matches Render Method 
 */
function Awaiting (props, {navigation}) {
    const [data, setData] = useState([]);
    // const [loading, setLoading]= useState(true);
    const [matchIDs, setMatchIDs] = useState({});
    const [selectedID, setSelectedID] = useState(null)
    
    /**
     * Load Page Data Asynchronously
     */
    async function loadAsync() {
      await firebaseSvc
            .getAwaitingMatchIDs(
              snapshot => {
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
                    newData = newData.concat(value);
                  }
                  newData.sort(function (a, b) {
                    let x = new Date(a.datetime)
                    let y = new Date(b.datetime)
                    return x <= y ? -1 : 1
                  });
                  setData(newData);
                // console.log(data);
                }
              },
              x => x,
              err => {console.log(err.message)}
            )
            setSelectedID(Math.random())
        // setLoading(false);
    }

    const dateStringMaker = (date) => {
      return date.slice(0, 11) + timeStringMaker(date)
    }
    const timeStringMaker = (date) => {
      return date.slice(16, 21)
    }

    useEffect(() => {
        loadAsync();
        return () => {
          console.log('awaitingMatchID clean up!');
          firebaseSvc.awaitingMatchIDsOff();
        }
    }, [])

    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', async() => {
          await loadAsync();
      })
      return unsubscribe;
    }, [navigation])
    // const pickImage = item => FOOD_IMAGES_URIs[item.cuisinePreference];
    
    return (
      <SafeAreaView>
          <FlatList
            extraData={selectedID}
            data={data}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={{borderBottomWidth:5, height: 110}}
              key={index} 
              roundAvatar>
                <Avatar size='large' avatarStyle={{borderRadius: 120}} source={{uri:FOOD_IMAGES_URIs[item.cuisinePreference]}} />
                <ListItem.Content>
                  <View>
                  <ListItem.Title style={{fontWeight: 'bold'}}>{`${item.cuisinePreference} Cuisine`}</ListItem.Title>
                  <ListItem.Title style={{fontWeight: 'bold'}}>{`${INDUSTRY_CODES[item.industry]} Industry`}</ListItem.Title>
                  </View>
                  <View>
                  <ListItem.Subtitle>{dateStringMaker(item.datetime)}</ListItem.Subtitle>
                  </View>
                </ListItem.Content>
                <View style={{flexDirection: 'column'}}>
                <TouchableOpacity onPress={async() => 
                              {
                                props.navigation.navigate('Edit Gobble Request', {edit: true, request: item})
                                console.log('Edit awaiting')
                              }}>
                  <ListItem.Subtitle style={{color: '#c3990b'}}>{`Edit`}</ListItem.Subtitle>
                </TouchableOpacity>
                <TouchableOpacity onPress={async() => 
                              {
                                let replacementSelectedID = Math.random()
                                firebaseSvc.deleteAwaitingRequest(item);
                                setSelectedID(replacementSelectedID)
                                console.log('Delete awaiting')
                              }}>
                  <ListItem.Subtitle style={{color: 'red'}}>{`Delete`}</ListItem.Subtitle>
                </TouchableOpacity>
                </View>
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
export default connect(mapStateToProps, mapDispatchProps)(Awaiting);