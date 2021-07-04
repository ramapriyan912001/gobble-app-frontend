import React from 'react'
import {View, ActivityIndicator} from 'react-native'
import themes from '../styles/Themes';

export const renderFooter  = (isLight) =>() => {
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: themes.oppositeTheme(!isLight)
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
};