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
import { FOOD_IMAGES_URIs } from '../../constants/objects'
import { INDUSTRY_CODES } from '../../constants/objects'

/**
 * Page to Load the Pending Matches Screen
 * 
 * @param {*} props Props from previous screen
 * @returns Matches Render Method 
 */
function Matches (props, {navigation}) {
    const [data, setData] = useState([]);
    // const [loading, setLoading]= useState(true);
    const [matchIDs, setMatchIDs] = useState({});
    
    /**
     * Load Page Data Asynchronously
     */
    async function loadAsync() {
      await firebaseSvc
            .getPendingMatchIDs(
              snapshot => {
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
                    newData = newData.concat(value);
                  }
                  setData(newData);
                // console.log(data);
                }
              },
              x => x,
              err => {console.log(err.message)}
            )
        // setLoading(false);
    }

    const dateStringMaker = (date) => {
      return date.slice(0, 21)
    }

    useEffect(() => {
        loadAsync();
        return () => {
          console.log('pendingMatchID clean up!');
          firebaseSvc.pendingMatchIDsOff();
        }
    }, [data, matchIDs])

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
export default connect(mapStateToProps, mapDispatchProps)(Matches);