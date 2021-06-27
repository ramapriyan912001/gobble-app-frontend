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

function MatchesHistory (props) {
    const [data, setData] = useState([]);
    const [matchIDs, setMatchIDs] = useState({});
    // const [loading, setLoading]= useState(true);
    
    async function loadAsync() {
      await firebaseSvc
            .getMatchIDs(
              async(snapshot) => {
                let ids = snapshot.val();
                // console.log(ids, 'ids')
                for(let key in ids) {
                  if(!(key in matchIDs)) {
                    matchIDs[key] = true;
                    let details = ids[key]
                    let otherUserId = details.otherUserId
                    let avatar, industry;
                    await firebaseSvc.avatarRef(details.otherUserId).on("value", subsnap => {details = {...details, otherUserAvatar: subsnap.val()}})
                    await firebaseSvc.industryRef(details.otherUserId).on("value", subsnap => {details = {...details, otherUserIndustry: subsnap.val()}})
                    setData(data.concat(details))
                  }
                }
                // console.log(data);
              },
              x => x,
              err => {console.log(err.message)}
            )
        // setLoading(false);
    }

    useEffect(() => {
        loadAsync();
        return () => {
          console.log('matchHistory clean up!');
          firebaseSvc.matchIDsOff();
        }
    }, [])

    const pickImage = item =>   {
      return item.otherUserAvatar == null || item.otherUserAvatar == ''
                                ? 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/avatar%2Fempty_avatar.png?alt=media&token=c36c29b3-d90b-481f-a9d9-24bc73619ddc'
                                : item.otherUserAvatar};
    
    return (
      <SafeAreaView>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={{borderBottomWidth:5, height: 160}}
              key={index} 
              roundAvatar>
                <Avatar size="large" source={{uri:pickImage(item)}}/>
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
export default connect(mapStateToProps, mapDispatchProps)(MatchesHistory);