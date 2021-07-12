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
        <View style={{height: 150, width: 300,}}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 2}}>
                <Avatar avatarStyle={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 8,
                        height: 8,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 9,
                    elevation: 5,
                }} size='xlarge' avatarStyle={{}} source={{uri: giveUrl()}}></Avatar>
                </View>
                <View style={{flexWrap: 'nowrap', flexDirection: 'column', marginLeft: '50%', justifyContent: 'center'}}>
                <Text style={{fontWeight: '800', marginBottom: '3%'}}>{`${restaurant.name}`}</Text>
                <Text style={{fontWeight: '600', marginBottom: '3%'}}>{`${restaurant.address}`}</Text>
                <Rating
                type='star'
                ratingImage='star'
                ratingColor='#3498db'
                ratingBackgroundColor='#000000'
                ratingCount={5}
                startingValue={restaurant.rating}
                imageSize={20}
                readonly
                style={{ paddingHorizontal: 1, paddingVertical: 2 }}
                />
                </View>
                
            </View>
        </View>
    )
}