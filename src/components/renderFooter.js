import React from 'react'
import {View, ActivityIndicator} from 'react-native'

export default function renderFooter () {
    if (!state.loading) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
};