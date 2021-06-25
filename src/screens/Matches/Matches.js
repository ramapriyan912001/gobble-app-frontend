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
    const [data, setData] = useState([]);
    const [loading, setLoading]= useState(true);
    
    async function loadAsync() {
      await firebaseSvc
            .getPendingMatchIDs(
              snapshot => {
                let ids = snapshot.val();
                for(let key in ids) {
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

    const pickImage = item => FOOD_IMAGES_URIs[item.cuisinePreference];
    
    return (
      <SafeAreaView>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={{borderBottomWidth:0}}
              key={index} 
              roundAvatar>
                <Avatar source={{uri:pickImage(item)}} />
                <ListItem.Content>
                  <ListItem.Title>{item.datetime}</ListItem.Title>
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
export default connect(mapStateToProps, mapDispatchProps)(Matches);