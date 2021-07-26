import React, {useEffect, useState} from 'react'
import {View, SafeAreaView, Text, FlatList, TouchableOpacity, Alert} from 'react-native'
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
import {styles} from '../styles/ProfileStyles';
import { REASONS } from '../constants/objects'

/**
 * Page to Load the Pending Matches Screen
 * 
 * @param {*} props Props from previous screen
 * @returns Matches Render Method 
 */
export default function Reports (props, {navigation}) {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === 'light';
    const [data, setData] = useState([]);
    const [authAdmin, setAuthAdmin] = useState(firebaseSvc.isAuthAdmin());
    // const [loading, setLoading]= useState(true);
    const [reportIDs, setReportIDs] = useState({});
    const [selectedID, setSelectedID] = useState(true);
    const [currentID, setCurrentID] = useState(firebaseSvc.uid);
    
    /**
     * Load Page Data Asynchronously
     */
    async function loadAsync() {
        console.log('Loading Reports...');
      await firebaseSvc
            .getReports(
              snapshot => {
                let ids = snapshot.val();
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
      return date.slice(0, 10)
  }
  const timeStringMaker = (date) => {
      return date.slice(16, 21)
  }

    useEffect(() => {
        loadAsync();
        return () => {
          firebaseSvc.reportsOff(currentID);
          console.log("Reports clean up!");
        }
    }, [navigation])

    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', async() => {
          await loadAsync();
          console.log('change')
      })
      return unsubscribe;
    }, [navigation])
    // const pickImage = item => FOOD_IMAGES_URIs[item.cuisinePreference];
    
    return (
      <SafeAreaView style={[{height: '100%', flex: 1}, themes.containerTheme(isLight)]}>
          <FlatList
            extraData={selectedID}
            data={data}
            contentContainerStyle={themes.containerEditTheme(isLight)}
            style={themes.containerTheme(isLight)}
            renderItem={({ item, index }) => (
              <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Report Details', {...item, buttons: true})
              }}>
              <ListItem
              containerStyle={[{borderBottomWidth:5, height: 110}, themes.containerTheme(isLight)]}
              key={index} 
              roundAvatar>
                <View style={{flexDirection: 'column', borderColor: themes.oppositeTheme(isLight), paddingRight: '2.5%',borderRightWidth: 2}}>
                          <ListItem.Subtitle style={[{fontWeight: '500'}, themes.textTheme(isLight)]}>{`${dateStringMaker(item.datetime)}`}</ListItem.Subtitle>
                          <ListItem.Subtitle style={[{fontWeight: '300'}, themes.textTheme(isLight)]}>{`${timeStringMaker(item.datetime)}`}</ListItem.Subtitle>
                </View>
                <ListItem.Content>
                  <View>
                  <ListItem.Title style={[{fontWeight: 'bold'}, themes.textTheme(isLight)]}>{`${REASONS[item.complaint.reason]}`}</ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>
              </TouchableOpacity>
              
            )}
            keyExtractor={item => item.datetime}
            ItemSeparatorComponent={renderSeparator}
            // ListHeaderComponent={renderHeader}
            // ListFooterComponent={renderFooter(isLight)}
            onEndReachedThreshold={50}
          />
          {!authAdmin && <TouchableOpacity
            style={[{...styles.longButton, marginBottom:'4%'}, themes.buttonTheme(isLight)]}
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
              const message = await firebaseSvc.promoteCurrentUserToAdmin();
              Alert.alert('Done!',message);
          }}>
              <Text style={themes.textTheme(!isLight)}>Promote to Admin</Text>
          </TouchableOpacity>}
      </SafeAreaView>
    );
}
