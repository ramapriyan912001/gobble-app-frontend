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

function MatchesHistory (props) {
    const [data, setData] = useState([]);
    const [loading, setLoading]= useState(true);
    
    async function loadAsync() {
      await firebaseSvc
            .getMatchIDs(
              snapshot => {
                let ids = snapshot.val();
                for(let key in ids) {
                    console.log(ids[key]);
                    setData(data.concat(ids[key]))
                }
                console.log(data);
              },
              err => {console.log(err.message)}
            )
        setLoading(false);
    }

    useEffect(() => {
        loadAsync();
    }, [])

    const pickImage = item => item.otherUser.avatar == null 
                                ? 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/avatar%2Fempty_avatar.png?alt=media&token=c36c29b3-d90b-481f-a9d9-24bc73619ddc'
                                : item.otherUser.avatar;
    
    return (
      <SafeAreaView>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={{borderBottomWidth:0}}
              key={index} 
              roundAvatar>
                <Avatar source={{uri:pickImage(item)}}/>
                <ListItem.Content>
                  <ListItem.Title>{item.otherUser.name}</ListItem.Title>
                  <ListItem.Subtitle>{`${item.cuisinePreference} cuisine, ${item.industryPreference} industry`}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={item => item.datetime}
            ItemSeparatorComponent={renderSeparator}
            // ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter(loading)}
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
export default connect(mapStateToProps, mapDispatchProps)(MatchesHistory);