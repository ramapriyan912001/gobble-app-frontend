import React, {useState} from 'react'
import {View, Text, Button} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import DateTimePickerModal from "react-native-modal-datetime-picker";

export function GobbleSelect() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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
        <View style={containerStyles.container}>
            <View>
                <Button title="Show Date Picker" onPress={showDatePicker} />
                <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                />
            </View>
        </View>
    )
}