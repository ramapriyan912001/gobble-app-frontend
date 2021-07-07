import React, {useEffect, useState} from 'react'
import {View, SafeAreaView, Text, FlatList, TouchableOpacity} from 'react-native'
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
import themes from '../styles/Themes';
import {styles} from '../styles/RegisterStyles';

/**
 * Page to Load the Pending Matches Screen
 * 
 * @param {*} props Props from previous screen
 * @returns Matches Render Method 
 */
function Reports (props, {navigation}) {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === 'light';
    const [data, setData] = useState([]);
    // const [loading, setLoading]= useState(true);
    const [reportIDs, setReportIDs] = useState({});
    const [selectedID, setSelectedID] = useState(true)
    
    /**
     * Load Page Data Asynchronously
     */
    async function loadAsync() {
        console.log('hey')
      await firebaseSvc
            .getReports(
              snapshot => {
                let ids = snapshot.val();
                console.log(ids)
                if (ids == null) {
                  setData([])
                  setReportIDs({})
                } else  {
                  let newData = [];
                  for(let [key, value] of Object.entries(ids)) {
                    newData = newData.concat({...value, id: key});
                  }
                  setData(newData);
                }
              },
              x => x,
              err => {console.log(err.message)}
            )
            setSelectedID(Math.random())
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
          console.log('Reports clean up!');
          firebaseSvc.reportsOff();
        }
    }, [])

    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', async() => {
          await loadAsync();
      })
      return unsubscribe;
    }, [navigation])
    // const pickImage = item => FOOD_IMAGES_URIs[item.cuisinePreference];
    
    return (
      <SafeAreaView style={themes.containerTheme(isLight)}>
          <FlatList
            extraData={selectedID}
            data={data}
            contentContainerStyle={themes.containerEditTheme(isLight)}
            style={themes.containerTheme(isLight)}
            renderItem={({ item, index }) => (
              <ListItem
              containerStyle={[{borderBottomWidth:5, height: 110}, themes.containerTheme(isLight)]}
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
                <View style={{flexDirection: 'column'}}>
                <TouchableOpacity onPress={async() => 
                              {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                                props.navigation.navigate('Edit Gobble Request', {edit: true, request: item})
                                console.log('Edit awaiting')
                              }}>
                  <ListItem.Subtitle style={{color: themes.editLabelTheme(isLight)}}>{`Edit`}</ListItem.Subtitle>
                </TouchableOpacity>
                <TouchableOpacity onPress={async() => 
                              {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                                let replacementSelectedID = Math.random()
                                firebaseSvc.deleteAwaitingRequest(item);
                                setSelectedID(replacementSelectedID)
                                console.log('Delete awaiting')
                              }}>
                  <ListItem.Subtitle style={{color: 'red'}}>{`Delete`}</ListItem.Subtitle>
                </TouchableOpacity>
                </View>
              </ListItem>
            )}
            keyExtractor={item => item.datetime}
            ItemSeparatorComponent={renderSeparator}
            // ListHeaderComponent={renderHeader}
            // ListFooterComponent={renderFooter(isLight)}
            onEndReachedThreshold={50}
          />
          <Text>Reports</Text>
      </SafeAreaView>
    );
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Reports);