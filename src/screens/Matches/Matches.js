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

function Matches (props) {
    const [state, setState] = useState({
        loading: false,
        data: [{name: {first: 'hey', last: 'hey', email: 'hey'}}],
        error: null,
        refreshing: false
    });
    const [avatar, setAvatar] = useState('https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/avatar%2Fempty_avatar.png?alt=media&token=c36c29b3-d90b-481f-a9d9-24bc73619ddc');
    const [search, setSearch] = useState([])
    async function loadAsync() {
        // let pendingMatchesArray = await firebaseSvc.getPendingMatchIDs(snapshot => 
        //   Object.values(snapshot.val()).map(pendingMatch => 
        //     firebaseSvc.getUserCollection(pendingMatch.otherUserId, snapshot => 
        //       {
        //         const user = snapshot.val()
        //         state.push({name: user.name, avatar: user.avatar, industry: user.industry, dob: user.dob,})
        //       })), err => console.log(err));
        // let matchesArray = await firebaseSvc.getMatchIDs(snapshot => snapshot.val(), err => console.log(err));
        // console.log(pendingMatchesArray)
        // console.log(matchesArray)
        const page = state.page;
        const seed = state.seed;
        const url = `https://randomuser.me/api/?seed=1&page=1&results=20`;
        // setState(
        await fetch(url)
          .then(res => res.json())
          .then(res => {
            // console.log(res.results)
            setState({...state,
              data: res.results,
              error: null,
              loading: false,
              refreshing: false
            });
          })
          .catch(error => {
              console.log(error);
            setState({...state, loading: false });
          })
    }

    useEffect(() => {
        loadAsync();
    }, [])

    const pickImage = item => {
      return item.picture == null||item.picture.thumbnail == ''
              ? avatar
              : item.picture.thumbnail;
    }
    
    return (
      <SafeAreaView>
        {/* <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}> */}
          <FlatList
            data={state.data}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={{borderBottomWidth:0}}
              key={index} 
              roundAvatar>
                <Avatar source={{uri: pickImage(item)}} />
                <ListItem.Content>
                  <ListItem.Title>{`${item.name} ${item.name.last}`}</ListItem.Title>
                  <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={item => item.email}
            ItemSeparatorComponent={renderSeparator}
            // ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter(state)}
            onEndReachedThreshold={50}
          />
      {/* </List> */}
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
        