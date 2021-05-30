import {StyleSheet} from 'react-native'

export const buttonStyles = StyleSheet.create({
    forgot_button: {
        height: 30,
        marginBottom: '6%',
    },

    loginBtn: {
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
    }
});

export const imageStyles = StyleSheet.create({
    gobbleimg: {
        width: '50%',
        height: '30%',
        marginBottom: '10%',
        marginLeft: '2%',
        marginTop: '-20%'
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
      
    TextInput: {
        height: 50,
        flex: 1,
        width: 200,
        paddingLeft: "6%"
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