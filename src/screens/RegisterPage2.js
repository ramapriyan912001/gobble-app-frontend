import { SafeAreaView, View, Text} from "react-native";
import {Picker} from '@react-native-picker/picker'
import {pickerStyles} from '../styles/LoginStyles'


export default function RegisterPage2(props) {
    const initialState = props.navigation.getParam('state');
    <SafeAreaView>
        <View>
        <Text style={pickerStyles.switchText}>What are your dietary restrictions?</Text>
            <Picker
                        selectedValue={diet}
                        onValueChange={(newDiet, itemIndex) => {setDietPreference(newDiet);initialState.diet = newDiet;}}
                        style={pickerStyles.picker}
                        enabled= {true}
                        >
                        <Picker.Item label="Halal" value="halal" />
                        <Picker.Item label="Vegetarian" value="vegetarian" />
                        <Picker.Item label="Vegan/Strictly Vegetarian" value="vegan" />
                        <Picker.Item label="No Restrictions" value='nonhalal' />
            </Picker>
        </View>
        <View>
            <Text style={pickerStyles.switchText}>What is your preferred cuisine?</Text>
                    <Picker
                        selectedValue={cuisine}
                        onValueChange={(newCuisineItem, itemIndex) => {setCuisinePreference(newCuisineItem);initialState.cuisine = newCuisineItem;}}
                        style={pickerStyles.picker}
                        >
                        <Picker.Item label="Indian" value="indian" />
                        <Picker.Item label="Asian" value="asian" />
                        <Picker.Item label="Malaysian" value="malay" />
                        <Picker.Item label="Western" value='western' />
                        <Picker.Item label="Others" value='others' />
            </Picker>
        </View>
        <TouchableOpacity style={buttonStyles.loginButton} 
                        onPress={
                            () => {
                                    console.log('API CALL FOR REGISTER');
                                    props.navigation.navigate('RegisterPage3', {state: initialState});
                            }
                        }>
                    <Text style={buttonStyles.loginButtonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
            <Text style={buttonStyles.loginButtonText}>Back to Previous Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('Login')}>
            <Text style={buttonStyles.loginButtonText}>Back to Login</Text>
        </TouchableOpacity>
    </SafeAreaView>
}