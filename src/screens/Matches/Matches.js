import React, {Component, useEffect, useState} from 'react'
import {View, Text, FlatList} from 'react-native'
import { List, ListItem, SearchBar } from 'react-native-elements'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserData, clearData } from '../../redux/actions/actions'
import renderFooter from '../../components/renderFooter'
import renderSeparator from '../../components/renderSeparator'
import renderHeader from '../../components/renderHeader'

function Matches (props) {
    let state ={
        loading: false,
        data: [{name: {first: 'hey', last: 'hey', email: 'hey'}}],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false
    }
    async function loadAsync() {
        const page = state.page;
        const seed = state.seed;
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
        state = await fetch(url)
          .then(res => res.json())
          .then(res => {
            console.log(res.results)
            state = {...state,
              data: res.results,
              error: null,
              loading: false,
              refreshing: false
            };
          })
          .catch(error => {
              console.log("err")
            state = {...state, loading: false };
        });
    }

    useEffect(() => {
        loadAsync();
    }, [])
    
    return (
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
          data={state.data}
          renderItem={({ item }) => (

            <ListItem
              roundAvatar
              title={`${item.name.first} ${item.name.last}`}
              subtitle={item.email}
            //   avatar={{ uri: item.picture.thumbnail }}
              containerStyle={{ borderBottomWidth: 0 }}
            />
          )}
          keyExtractor={item => item.email}
          ItemSeparatorComponent={renderSeparator}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={50}
        />
      </List>
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
        