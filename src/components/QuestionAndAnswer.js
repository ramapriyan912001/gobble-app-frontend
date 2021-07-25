import React from 'react'
import { SafeAreaView } from 'react-native'
import { View, Text, StyleSheet } from 'react-native'
import { inputStyles } from '../styles/LoginStyles'
import themes from '../styles/Themes'
import { useColorScheme } from 'react-native-appearance'

export default function QuestionAndAnswer(props) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    return (
        <SafeAreaView style={[styles.containerStyle, themes.containerTheme(isLight)]}>
            <Text style={[styles.questionStyle, themes.textTheme(isLight)]}>{`Q. ${props.question}`}</Text>
            <Text style={[styles.answerStyle, themes.textTheme(isLight)]}>{`${props.answer}`}</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        marginBottom: '2%',
        marginTop: '2%',
        marginLeft: '2.5%',
        marginRight: '2%'
    },
    questionStyle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    answerStyle: {
        fontSize: 14
    }
})
