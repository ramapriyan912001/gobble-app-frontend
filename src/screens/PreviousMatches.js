import React, {useEffect, useState} from 'react'
import {View, SafeAreaView, Text, FlatList} from 'react-native'
import { Avatar, ListItem, SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserData, clearData } from '../redux/actions/actions'
import { renderFooter } from '../components/renderFooter'
import renderSeparator from '../components/renderSeparator'
import renderHeader from '../components/renderHeader'
import firebaseSvc from '../firebase/FirebaseSvc'
import { FOOD_IMAGES_URIs } from '../constants/objects'
import { INDUSTRY_CODES } from '../constants/objects'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '.././styles/Themes';
import {styles} from '.././styles/ProfileStyles';

/**
 * Page to Show previous Matches
 * 
 * @param {*} props Props from previous screen
 * @returns MatchesHistory Render Method 
 */
 export default function PreviousMatches (props, {navigation}) {
   const colorScheme = useColorScheme();
   const isLight = colorScheme === 'light';
    const [data, setData] = useState([]);
    const [selectedID, setSelectedID] = useState(null)
    const [matchIDs, setMatchIDs] = useState({})

    function renderContent(item, index) {
      const dateStringMaker = (date) => {
          return date.slice(0, 10)
      }
      const timeStringMaker = (date) => {
          return date.slice(16, 21)
      }
      return (
          <ListItem
                        containerStyle={[{borderBottomWidth:5, height: 110}, themes.containerTheme(isLight)]}
                        key={props.index} 
                        roundAvatar>
                          <View style={{flexDirection: 'column', borderColor: themes.oppositeTheme(isLight), paddingRight: '2.5%',borderRightWidth: 2}}>
                          <ListItem.Subtitle style={[{fontWeight: '500'}, themes.textTheme(isLight)]}>{`${dateStringMaker(item.datetime)}`}</ListItem.Subtitle>
                          <ListItem.Subtitle style={[{fontWeight: '300'}, themes.textTheme(isLight)]}>{`${timeStringMaker(item.datetime)}`}</ListItem.Subtitle>
                          </View>
                          <ListItem.Content>
                            <ListItem.Title style={[{fontWeight: '500'}, themes.textTheme(isLight)]}>{`${INDUSTRY_CODES[item.otherUserIndustry]} Industry`}</ListItem.Title>
                            <ListItem.Title style={[{fontWeight: '300'}, themes.textTheme(isLight)]}>{`${item.cuisinePreference} Cuisine`}</ListItem.Title>
                          </ListItem.Content>
                        </ListItem>
          )
  }
    /**
     * Load Data Asynchronously
     */
    async function loadAsync() {
      await firebaseSvc
            .getMatchIDs(
              async(snapshot) => {
                let ids = snapshot.val();
                if (ids == null) {
                  setData([])
                  setMatchIDs({})
                } else  {
                  // console.log(ids, 'ids')
                  let newData = [];
                  for(let [key, value] of Object.entries(ids)) {
                    let details = ids[key]
                    let otherUserId = details.otherUserId
                    if(otherUserId != props.route.params.otherUser.id) {
                      continue;
                    }
                      await firebaseSvc
                            .avatarRef(otherUserId)
                            .once("value")
                            .then(subsnap => {details = {...details, otherUserAvatar: subsnap.val()}})
                            .catch(err => console.log('Error Loading Avatar:',err.message));
                      await firebaseSvc
                            .industryRef(otherUserId)
                            .once("value")
                            .then(subsnap => {details = {...details, otherUserIndustry: subsnap.val()}})
                            .catch(err => console.log('Error Loading Avatar:',err.message));
                    newData = newData.concat(details);
                  }
                  newData.sort(function (a, b) {
                    let x = new Date(a.datetime)
                    let y = new Date(b.datetime)
                    return x <= y ? 1 : -1
                  });
                  setData(newData);
                }
              },
              x => x,
              err => {console.log('Error Loading Matched IDs:',err.message)}
            )
        // setLoading(false);
    }

    useEffect(() => {
        loadAsync();
        return () => {
          console.log('pendingMatchID clean up!');
          firebaseSvc.matchIDsOff();
        }
    },[])

    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', async() => {
          await loadAsync();
      })
      return unsubscribe;
    }, [navigation])
    
    return (
      <SafeAreaView style={[{height: '100%'}, themes.containerTheme(isLight)]}>
          <FlatList
            data={data}
            extraData={selectedID}
            renderItem={({ item, index }) => renderContent(item, index)}
            keyExtractor={item => item.matchID}
            ItemSeparatorComponent={renderSeparator}
            // ListHeaderComponent={renderHeader}
            // ListFooterComponent={renderFooter(loading)}
            onEndReachedThreshold={50}
          />
      </SafeAreaView>
    );
}