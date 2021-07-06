import React, { useState, useEffect } from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { View, Text } from 'react-native'
import { EMPTY_AVATAR } from '../constants/objects'
import { Ionicons } from '@expo/vector-icons'

export default function MapSelect(props) {

    const [lat, setLat] = useState(0)
    const [long, setLong] = useState(0)
    const [edited, setEdited] = useState(false);

    useEffect(() => {
        // console.log(props)
        // console.log()
        // if(props.route.params && !edit) {
        //     setLat(props.route.params.lat)
        //     setLong(props.route.params.long)
        // }
    }, [lat, long])

    return (
        <View
         style={{
            flex: 1,
            backgroundColor: '#a0abff',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <MapView
                showsUserLocation
                style={{height: '100%', width: '100%'}}
                provider={PROVIDER_GOOGLE}
                onPress={() => {
                    console.log("press")
                }}
                initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
            >
            <Marker
            coordinate={{latitude: lat, longitude: long}}>
                <Ionicons name='fast-food' color={'#008a49'} size={28}></Ionicons>
            </Marker>
            </MapView>
        </View>
    )
}