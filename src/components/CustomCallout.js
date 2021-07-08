import React, { useEffect, useState } from 'react'
import { Image, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import { API } from '../api'
import { EMPTY_AVATAR } from '../constants/objects';
import { Avatar } from 'react-native-elements';
import { Rating } from 'react-native-ratings';

export default function CustomCallout({restaurant}) {

    const [data, setData] = useState(EMPTY_AVATAR)

    async function loadDataAsync() {
        let queryString = 'https://maps.googleapis.com/maps/api/place/photo?'
        let photo_reference = restaurant.photo_reference
        let API_KEY = 'AIzaSyC6h4poHiCJzIWZGNZ5JThvwpTjk0q7eWo'
        queryString = queryString + `maxheight=200&photoreference=${photo_reference}&key=${API_KEY}`
        let temp = await API.get(queryString)
        setData(temp.request.responseURL)
    }

    function giveUrl() {
        return data;
    }

    useEffect(() => {
        loadDataAsync();
    }, [data])
    return (
        <View style={{height: 250, width: 300, alignItems: 'center'}}>
                <Avatar size='xlarge' avatarStyle={{alignSelf: 'center'}} source={{uri: giveUrl()}}></Avatar>
                <Text style={{alignSelf:'center'}}>{`${restaurant.name}`}</Text>
                <Text style={{alignSelf:'center'}}>{`This restaurant has a ${restaurant.rating} star rating`}</Text>
                {/* <Rating
                type='star'
                ratingImage='star'
                ratingColor='#3498db'
                ratingBackgroundColor='#000000'
                ratingCount={5}
                startingValue={restaurant.rating}
                imageSize={20}
                readonly
                style={{ paddingHorizontal: 1 }}
                /> */}
        </View>
    )
}