import React, { useRef } from 'react'
import {Text, View, Image} from 'react-native'
import {imageStyles, inputStyles, containerStyles} from '../styles/LoginStyles'

export default function Welcome(props) {
    return (
    <View style={containerStyles.container}>
        <Text style={inputStyles.headerText}>Welcome to</Text>
        <Image style={imageStyles.gobbleImage} source = {require('../images/gobble.png')}/>
    </View>
    );
};


