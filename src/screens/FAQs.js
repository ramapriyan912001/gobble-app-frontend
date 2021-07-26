import React from 'react'
import { SafeAreaView } from 'react-native'
import { View, Text } from 'react-native-animatable'
import QuestionAndAnswer from '../components/QuestionAndAnswer'
import { QUESTION_AND_ANSWER } from '../constants/objects'
import themes from '../styles/Themes'
import { useColorScheme } from 'react-native-appearance'
import { ScrollView } from 'react-native'

export default function FAQs(props) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    return (
        <ScrollView style={[{flex: 1,},themes.containerTheme(isLight)]}>
            <View style={{marginTop: '2%', marginBottom: '2%'}}>
                {QUESTION_AND_ANSWER.map((qna, index) => {
                    return (<QuestionAndAnswer {...{...props, question: qna.Question, answer: qna.Answer}} key={index}/>)
                })}
            </View>
        </ScrollView>
    )
}