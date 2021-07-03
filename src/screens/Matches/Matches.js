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
function Matches (props) {
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

    useEffect(() => {
        loadAsync();
        return () => {
          console.log('pendingMatchID clean up!');
          firebaseSvc.pendingMatchIDsOff();
        }
    }, [])
    // const pickImage = item => FOOD_IMAGES_URIs[item.cuisinePreference];
    
    return (
      <SafeAreaView>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={{borderBottomWidth:5, height: 160}}
              key={index} 
              roundAvatar>
                <Avatar size='large' source={{uri:FOOD_IMAGES_URIs[item.cuisinePreference]}} />
                <ListItem.Content>
                  <ListItem.Title>{item.datetime}</ListItem.Title>
                  <ListItem.Subtitle>{`${item.cuisinePreference} cuisine, ${INDUSTRY_CODES[item.industry]} industry`}</ListItem.Subtitle>
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