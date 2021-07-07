import React, {useEffect, useState} from 'react';
import { SafeAreaView, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import PlaceRow from './PlaceRow';
// navigator.geolocation = require('@react-native-community/geolocation');
// navigator.geolocation = require('react-native-geolocation-service');

export default function DestinationSearch(props) {

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
    <SafeAreaView>
      <View style={{...styles.container, flexDirection: 'row'}}>
          <View
          style={{marginTop: '0%'}}>
              <TouchableOpacity style={{paddingRight: '4%'}} onPress={() => {
                  props.navigation.goBack()
              }}>
                <Ionicons name="arrow-back" size={30}></Ionicons>
              </TouchableOpacity>
          </View>
          <GooglePlacesAutocomplete
          placeholder="Where will you be?"
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
          enablePoweredByContainer={false}
          suppressDefaultStyles
          currentLocation={true}
          currentLocationLabel='Current location'
          styles={{
            textInput: styles.textInput,
            container: styles.autocompleteContainer,
            listView: styles.listView,
            separator: styles.separator,
          }}
          fetchDetails
          renderRow={(data) => <PlaceRow data={data} />}
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
      backgroundColor: '#eee',
      marginVertical: 0,
      width: '100%'
    },
  
    separator: {
      backgroundColor: '#efefef',
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