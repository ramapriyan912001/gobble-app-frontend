import React, {useEffect, useState} from 'react'
import {View, SafeAreaView, Text, FlatList, TouchableOpacity} from 'react-native'
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
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';
import Loader from 'react-native-three-dots-loader'

/**
 * Page to Load the Pending Matches Screen
 * 
 * @param {*} props Props from previous screen
 * @returns Matches Render Method 
 */
export default function Awaiting (props, {navigation}) {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === 'light';
    const [data, setData] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});
    const [currentID, setCurrentID] = useState(firebaseSvc.uid);
    const [matchIDs, setMatchIDs] = useState({});
    const [selectedID, setSelectedID] = useState(null)
    
    /**
     * Load Page Data Asynchronously
     */
    async function loadAsync() {
      await firebaseSvc
            .getAwaitingMatchIDs(
              snapshot => {
                let ids = snapshot.val();
                let states = {};
                if (ids == null) {
                  setData([])
                  setMatchIDs({})
                  setLoadingStates({})
                } else  {
                  // console.log(ids, 'ids')
                  let newData = [];
                  for(let [key, value] of Object.entries(ids)) {
                    states[key] = false;
                    if(!(key in matchIDs)) {
                      matchIDs[key] = true;
                    }
                    newData = newData.concat(value);
                  }
                  newData.sort(function (a, b) {
                    let x = new Date(a.datetime)
                    let y = new Date(b.datetime)
                    return x <= y ? -1 : 1
                  });
                  setLoadingStates(states)
                  setData(newData);
                // console.log(data);
                }
              },
              x => x,
              err => {console.log(err.message)}
            )
            setSelectedID(Math.random())
        // setLoading(false);
    }

    const dateStringMaker = (date) => {
      return date.slice(0, 11) + timeStringMaker(date)
    }
    const timeStringMaker = (date) => {
      return date.slice(16, 21)
    }

    useEffect(() => {
        loadAsync();
        return () => {
          console.log('awaitingMatchID clean up!');
          firebaseSvc.awaitingMatchIDsOff(currentID);
        }
    }, [])

    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', async() => {
          await loadAsync();
      })
      return unsubscribe;
    }, [navigation])
    // const pickImage = item => FOOD_IMAGES_URIs[item.cuisinePreference];
    if(data.length != 0) {
    return (
      <SafeAreaView style={[{height: '100%'}, themes.containerTheme(isLight)]}>
          <FlatList
            testID={'AwaitingFlatList'}
            extraData={selectedID}
            data={data}
            contentContainerStyle={themes.containerEditTheme(isLight)}
            style={themes.containerTheme(isLight)}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={[{borderBottomWidth:3, height: 110}, themes.containerTheme(isLight)]}
              key={index} 
              roundAvatar>
                <Avatar size='large' avatarStyle={{borderRadius: 120}} source={{uri:FOOD_IMAGES_URIs[item.cuisinePreference]}} />
                <ListItem.Content>
                  <View>
                  <ListItem.Title style={[{fontWeight: 'bold'}, themes.textTheme(isLight)]}>{`${item.cuisinePreference} Cuisine`}</ListItem.Title>
                  <ListItem.Title style={[{fontWeight: 'bold'}, themes.textTheme(isLight)]}>{`${INDUSTRY_CODES[item.industry]} Industry`}</ListItem.Title>
                  </View>
                  <View>
                  <ListItem.Subtitle style={themes.textTheme(isLight)}>{dateStringMaker(item.datetime)}</ListItem.Subtitle>
                  </View>
                </ListItem.Content>
                {!loadingStates[item.matchID] &&
                <View style={{flexDirection: 'column'}}>
                  <TouchableOpacity onPress={async() => 
                                {
                                  let states = loadingStates
                                  states[item.matchID] = true;
                                  let replacementSelectedID = Math.random()
                                  setLoadingStates(states)
                                  setSelectedID(replacementSelectedID)
                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                                  props.navigation.navigate('Edit Gobble Request', {edit: true, request: item})
                                  console.log('Edit awaiting')
                                }}>
                    <ListItem.Subtitle style={{color: themes.editLabelTheme(isLight)}}>{`Edit`}</ListItem.Subtitle>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={async() => 
                                {
                                  let states = loadingStates
                                  states[item.matchID] = true;
                                  let replacementSelectedID = Math.random()
                                  setLoadingStates(states)
                                  setSelectedID(replacementSelectedID)
                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                                  replacementSelectedID = Math.random()
                                  await firebaseSvc.deleteAwaitingRequest(item);
                                  setSelectedID(replacementSelectedID)
                                  console.log('Delete awaiting')
                                }}>
                    <ListItem.Subtitle style={{color: 'red'}}>{`Delete`}</ListItem.Subtitle>
                  </TouchableOpacity>
                </View>
            }
            {loadingStates[item.matchID] &&
                            <View style={{flexDirection: 'column'}}>
                              <Loader useNativeDriver={true}/>
                            </View>
                          }
              </ListItem>
            )}
            keyExtractor={item => item.matchID}
            ItemSeparatorComponent={renderSeparator}
            // ListHeaderComponent={renderHeader}
            // ListFooterComponent={renderFooter(isLight)}
            onEndReachedThreshold={50}
          />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={[{flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}, themes.containerTheme(isLight)]}>
        <Text style={[{alignSelf: 'center', fontWeight:'bold'}, themes.textTheme(isLight)]}>You have no awaiting Gobbles!</Text>
      </SafeAreaView>
    )
  }
}