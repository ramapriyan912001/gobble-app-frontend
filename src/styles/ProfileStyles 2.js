import {StyleSheet} from 'react-native'

const light = '#ffe';
const dark = '#242C40';
const lighterDark = '#2e374f';
const darkerLight = '#ededd8';

export const styles = StyleSheet.create({
    container: {
            flex: 1,
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
        width:165,
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
});

export const profileStylesAddition = StyleSheet.create({
    darkEditButton: {
        backgroundColor: lighterDark,
        shadowColor: lighterDark,
        shadowRadius: 3.84,
    },
    lightEditButton: {
        backgroundColor: darkerLight,
        shadowColor: darkerLight,
        shadowRadius: 0.1,
    },
    darkEditContainer: {
        backgroundColor: lighterDark
    },
    lightEditContainer: {
        backgroundColor: darkerLight
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
      },
      item: {
        width: '50%', // is 50% of container width
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%'
      },
      labelStyle: {
          justifyContent: 'center',
          alignSelf:'center',
          borderBottomWidth: 1,
      },
      inputStyle: {
          width: 5,
          margin:0,
          padding:0,
          textAlign:'center',
          fontSize:12,    
      },
})