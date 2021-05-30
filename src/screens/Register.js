import React, {useState} from 'react'
import {Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar} from 'react-native'
import AnimatedMultistep from "react-native-animated-multistep";

import Step1 from "./step1";
import Step2 from "./step2";
import FinalStep from "./finalstep";

const allSteps = [
    { name: "step 1", component: Step1 },
    { name: "step 2", component: Step2 },
    { name: "final step", component: FinalStep}
];

export default function signUp(props) {
    const onNext = () => console.log("Next");

    const onBack = () => console.log("Back");

    const finish = finalState => console.log(finalState);

    return (
    <View style={{ flex: 1}}>
        <AnimatedMultistep
            steps={allSteps}
            onFinish={finish}
            onBack={onBack}
            onNext={onNext}
            comeInOnNext="bounceInUp"
            OutOnNext="bounceOutDown"
            comeInOnBack="bounceInDown"
            OutOnBack="bounceOutUp"
        />
    </View>);    
}