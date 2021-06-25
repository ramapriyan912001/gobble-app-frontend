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

function Matches (props) {
    const [state, setState] = useState({
        loading: false,
        data: [],
        error: null,
        refreshing: false
    });
    
    async function loadAsync() {
        let pendingMatchIDs = firebaseSvc.getPendingMatchIDs(snapshot => {
          let ids = snapshot.val();
          for(var key in ids) {
            state.data.push(ids[key])
          }
          console.log(state.data)
        })
    }

    useEffect(() => {
        loadAsync();
    }, [])

    const pickImage = item => {
      return FOOD_IMAGES_URIs[item.cuisinePreference]
    }
    
    return (
      <SafeAreaView>
          <FlatList
            data={state.data}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={{borderBottomWidth:0}}
              key={index} 
              roundAvatar>
                <Avatar source={{uri: pickImage(item)}} />
                <ListItem.Content>
                  <ListItem.Title>{item.datetime}</ListItem.Title>
                  <ListItem.Subtitle>{item.datetime}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={item => item.datetime}
            ItemSeparatorComponent={renderSeparator}
            // ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter(state)}
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






    // useEffect(() => {
    //     makeRemoteRequest();
    // }, [])
    
    // const handleRefresh = () => {
    //     setState(
    //       {
    //         page: 1,
    //         seed: state.seed + 1,
    //         refreshing: true
    //       },
    //       () => {
    //         makeRemoteRequest();
    //       }
    //     );
    //   };
    
    // const handleLoadMore = () => {
    //     setState(
    //       {
    //         page: state.page + 1
    //       },
    //       () => {
    //         makeRemoteRequest();
    //       }
    //     );
    //   };
        