import React, {useEffect, useState} from 'react'
import {View, SafeAreaView, Text, FlatList} from 'react-native'
import { Avatar, ListItem, SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserData, clearData } from '../../redux/actions/actions'
import { renderFooter } from '../../components/renderFooter'
import renderSeparator from '../../components/renderSeparator'
import renderHeader from '../../components/renderHeader'

function Matches (props) {
    const [state, setState] = useState({
        loading: false,
        data: [{name: {first: 'hey', last: 'hey', email: 'hey'}}],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false
    });
    const [avatar, setAvatar] = useState('https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/avatar%2Fempty_avatar.png?alt=media&token=c36c29b3-d90b-481f-a9d9-24bc73619ddc');
    const [search, setSearch] = useState('')
    async function loadAsync() {
        const page = state.page;
        const seed = state.seed;
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
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
        // );
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
                  <ListItem.Title>{`${item.name.first} ${item.name.last}`}</ListItem.Title>
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
        