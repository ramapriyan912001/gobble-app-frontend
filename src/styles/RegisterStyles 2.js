import {StyleSheet} from 'react-native'

const light = '#ffe';
const dark = '#242C40';

export const styles = StyleSheet.create({
    container: {
            flex: 1,
            flexDirection:'column',
            alignItems: 'center',
            justifyContent: 'center',
    },
    darkContainer: {
        backgroundColor: dark
    },
    lightContainer: {
        backgroundColor: light
    },
    longButton:{
        width:330,
        borderRadius:25,
        height:50,
        alignSelf:'center',
        alignItems:"center",
        justifyContent:"center",
        marginTop: '5%',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 9,
        elevation: 5,
    },
    inputView: {
        borderRadius: 30,
        width: "60%",
        height: 45,
        marginBottom: 20,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    darkInput: {
        backgroundColor: dark,
        shadowColor: light,
        shadowRadius: 0.1,
    },
    lightInput: {
        backgroundColor: light,
        shadowColor: dark,
        shadowRadius: 3.84,
    },
    darkText: {
        color: dark,
    },
    lightText: {
        color: light
    },
    darkButton: {
        backgroundColor: dark,
        shadowColor: dark,
        shadowRadius: 3.84,
    },
    lightButton: {
        backgroundColor: light,
        shadowColor: light,
        shadowRadius: 0.1,
    },
    tinyButton:{
        width:'42.5%',
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: '5%',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.3,
        elevation: 5,
    },
    image: {
        width: '70%',
        height: '40%',
        marginTop: '0%'
    },
    caption: {
        fontSize: 38,
        fontWeight: 'bold',
        marginBottom: '0%',
        textAlign: 'left',
        marginLeft:'1%'
    },
})