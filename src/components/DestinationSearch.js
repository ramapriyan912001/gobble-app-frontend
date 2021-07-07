import React, {useEffect, useState} from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import PlaceRow from './PlaceRow';
import themes from '../styles/Themes';
import { useColorScheme } from 'react-native-appearance';
// navigator.geolocation = require('@react-native-community/geolocation');
// navigator.geolocation = require('react-native-geolocation-service');

export default function DestinationSearch(props) {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === 'light';
    const [locationText, setLocationText] = useState('');
    const [location, setLocation] = useState({})

    const homePlace = {
        description: 'Home',
        geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
      };
      const workPlace = {
        description: 'Work',
        geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
      };

    useEffect(() => {
      if(location) {
        console.log("redirect to result")
      }
    }, [location])
    return (
    <SafeAreaView style={themes.containerTheme(isLight)}>
      <View style={{...styles.container, flexDirection: 'row'}}>
          <View
          style={{marginTop: '0%'}}>
              <TouchableOpacity style={{paddingRight: '4%'}} onPress={() => {
                  props.navigation.goBack()
              }}>
                <Ionicons name="arrow-back" style={themes.textTheme(isLight)} size={30}></Ionicons>
              </TouchableOpacity>
          </View>
          <GooglePlacesAutocomplete
          textInputProps={{ 
            placeholderTextColor: themes.oppositeTheme(isLight),
            selectionColor:themes.oppositeTheme(isLight),
            color:themes.oppositeTheme(isLight),
            clearButtonMode: 'never',
          }}
          styles={{
            textInput: {...styles.textInput, backgroundColor: themes.oppositeTheme(!isLight)},
            container: styles.autocompleteContainer,
            listView: styles.listView,
            separator: {...styles.separator, backgroundColor:themes.oppositeTheme(isLight)},
          }}
          onPress={(data, details=null) => {
            // 'details' is provided when fetchDetails = true
            setLocation({data, details})
            console.log(data.description)
            console.log(details.geometry.location)
            let request = props.route.params.request;
            request['location'] = {'coords': {'latitude': details.geometry.location['lat'], 'longitude': details.geometry.location['lng']}}
            const nav = 'Confirm Request'
            props.navigation.navigate(nav, {request: request,  edit: props.route.params.edit, description: data.description, oldRequest: props.route.params.oldRequest})
        }}
        query={{
            key: 'AIzaSyC6h4poHiCJzIWZGNZ5JThvwpTjk0q7eWo',
            language: 'en',
            // components: 'country:sg'
        }}
        placeholder='Type in your address'
        enablePoweredByContainer={false}
        suppressDefaultStyles
        currentLocation={true}
        currentLocationLabel='Current location'
        fetchDetails
        renderRow={(data) => {
          const title = data.description;
            return (
             <ListItem containerStyle={[themes.containerTheme(isLight)]}>
              <Ionicons name='location-outline' color={themes.oppositeTheme(isLight)} size={15}></Ionicons>
              <ListItem.Content  style={{backgroundColor:'transparent'}}>
                <ListItem.Title style={[themes.textTheme(isLight), {fontSize: 13, fontWeight:'bold'}]}>{data.description}</ListItem.Title>
              </ListItem.Content>
             </ListItem>
             );
        }}
        renderDescription={(data) => data.description || data.vicinity}
        //   predefinedPlaces={[homePlace, workPlace]}
        />
      </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      padding: 10,
      height: '100%',
    },
    textInput: {
      padding: '3%',
      marginVertical: 0,
      width: '100%'
    },
  
    separator: {
      height: 1,
    },
    listView: {
        top: '2%',
    },
    autocompleteContainer: {
      top: 0,
      left: 0,
      right: 0,
      width: '85%'
    },
    locationText: {
  
    },
  });