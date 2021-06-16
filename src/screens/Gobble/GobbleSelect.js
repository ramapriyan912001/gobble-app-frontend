import React, {useState} from 'react'
import {View, Text, Button, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native'
import {containerStyles, buttonStyles, inputStyles} from '../../styles/LoginStyles'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Picker} from '@react-native-picker/picker';

export function GobbleSelect() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [distance, setDistance] = useState(1);
  const [cuisinePreference, setCuisinePreference] = useState('')
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };
    return (
        <>
        <ScrollView contentContainerStyle={{...containerStyles.container, height: '200%'}}>
                <SafeAreaView style={{position: 'relative'}}>
                    <View style={{position: 'relative'}}>
                        <Text style={{...inputStyles.headerText, fontSize: 20, margin: '0%'}}>
                                Select your preferences and Gobble!
                        </Text>
                    </View>
                    <View style={{position: 'relative'}}>
                        <Text style={{...inputStyles.subHeader, margin: '0%'}}>Choose a date and time for your next Gobble!</Text>
                        <Button title="Select Date" onPress={showDatePicker} />
                        <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        />
                    </View>
                    <View style={{position: 'relative'}}>
                    <Text style={{...inputStyles.subHeader, margin: '0%'}}>...And How far are you willing to travel for a meal?</Text>
                    <Picker style={{margin: '0%'}}
                        selectedValue={cuisinePreference}
                        onValueChange={(itemValue, itemIndex) => {
                            setCuisinePreference(itemValue)
                        }}>
                        <Picker.Item label="Western" value={1}></Picker.Item>
                        <Picker.Item label="Indian" value={2}></Picker.Item>
                        <Picker.Item label="Asian" value={5}></Picker.Item>
                        <Picker.Item label="Food Court" value={10}></Picker.Item>
                        <Picker.Item label="No Preference" value={200}></Picker.Item>
                    </Picker>
                    </View>
                    <View style={{position: 'relative'}}>
                    <Text style={{...inputStyles.subHeader, margin: '0%'}}>...And what are you in the mood for today?</Text>
                    <Picker
                        style={{margin: '0%'}}
                        selectedValue={distance}
                        onValueChange={(itemValue, itemIndex) => {
                            setDistance(itemValue)
                        }}>
                        <Picker.Item label="1 km" value={1}></Picker.Item>
                        <Picker.Item label="2 km" value={2}></Picker.Item>
                        <Picker.Item label="5 km" value={5}></Picker.Item>
                        <Picker.Item label="10 km" value={10}></Picker.Item>
                        <Picker.Item label="No Preference" value={200}></Picker.Item>
                    </Picker>
                </View>
                <View style={{position: 'relative'}}>
                    <TouchableOpacity style={{...buttonStyles.loginButton, margin: '0%'}} onPress={() => props.navigation.navigate('GobbleConfirm')}>
                        <Text style={{...buttonStyles.loginButtonText, fontSize: 20}}>Find Gobblemate!</Text>
                    </TouchableOpacity>
                    <View>
                        <Text> Something something</Text>
                    </View>
                </View>
                </SafeAreaView>
        </ScrollView>
        </>
    )
}