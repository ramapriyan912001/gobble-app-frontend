import React from 'react'
import {Text, View, StyleSheet} from 'react-native'
import {containerStyles} from '../styles/LoginStyles'

export default function LoginConfirmation() {
    return (
        <View styles={containerStyles.containerStyles}>
            <Text style={styles.baseText}>
            I am bold
                <Text style={styles.innerText}> and red</Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    baseText: {
      fontWeight: 'bold'
    },
    innerText: {
      color: 'red'
    }
  });