import {StyleSheet} from 'react-native'
import { useFonts, IndieFlower_400Regular } from '@expo-google-fonts/indie-flower'
const _fontsLoaded = () => {
    let [fontsLoaded] = useFonts({
        IndieFlower_400Regular,
      });
}

export const buttonStyles = StyleSheet.create({
    forgotButton: {
        height: 30,
        marginBottom: '6%',
    },
    
    forgotButtonText: {
        // fontSize: 20,
        // fontFamily: 'IndieFlower_400Regular'
    },

    loginButton: {
        width:330,
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: '5%',
        backgroundColor:"#0aa859",
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 9,
        elevation: 5,
    },

    loginButtonText: {
        // fontSize: 28,
        // fontFamily: 'IndieFlower_400Regular'
    }
});

export const imageStyles = StyleSheet.create({
    gobbleImage: {
        width: '60%',
        height: '30%',
        marginBottom: '10%',
        marginLeft: '2%',
        marginTop: '-5%'
    }
});

export const inputStyles = StyleSheet.create({
    inputView: {
        backgroundColor: "#b5fbd7",
        borderRadius: 30,
        width: "60%",
        height: 45,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },

    inputHeader: {
    backgroundColor: "#fff",
    borderRadius: 30,
    width: "60%",
    height: 45,
    marginBottom: 20,
    // shadowColor: "#000",
    // shadowOffset: {
    //     width: 0,
    //     height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    },

    headerText: {
        fontSize: 25,
        fontWeight: 'bold'
    },

    TextInput: {
        height: 50,
        flex: 1,
        width: 200,
        paddingLeft: "6%",
        // fontSize: 20,
        // fontFamily: 'IndieFlower_400Regular'
    }

});

export const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }
});