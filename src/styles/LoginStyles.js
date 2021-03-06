import {StyleSheet} from 'react-native'

//TODO: Abstract styles by screen

export const buttonStyles = StyleSheet.create({
    forgotButton: {
        height: 30,
        marginBottom: '6%',
    },
    
    forgotButtonText: {
        // fontSize: 20,
        // fontFamily: 'IndieFlower_400Regular'
    },

    tinyButton:{
        width:'42.5%',
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: '5%',
        backgroundColor:"#0aa859",
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 9,
        elevation: 5,
    },

    loginButton: {
        width:'90%',
        borderRadius:25,
        height:50,
        alignSelf:'center',
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
    },

    buttonView: {
        alignSelf:"center",
        flexDirection:"column",
        justifyContent:"flex-end"
    }
});

export const imageStyles = StyleSheet.create({
    gobbleImage: {
        width: '60%',
        height:'30%',
        marginBottom: '10%',
        marginLeft: '2%',
        marginTop: '-5%'
    }
});

export const pickerStyles = StyleSheet.create({
    picker:{
        height: '28%',
        alignSelf:'center',
        width: '90%',
        marginBottom:'5%',
    },
    individualPicker:{
        height: '28%',
        alignSelf:'center',
        width: '90%',
        marginBottom:'30%'
    },
    datePicker:{
        height: '60%',
        alignSelf:'center',
        width: '90%',
        padding:'30%',
        justifyContent:'center',
    },
    dateText:{
        marginVertical:'5%',
        fontSize: 20,
        paddingHorizontal:'5%',
        fontWeight:'bold',
        alignSelf:'center',
    },
    text:{
        marginVertical:'3%',
        fontSize: 18,
        paddingHorizontal:'5%',
        fontWeight:'bold',
        alignSelf:'center',
        textAlign:'center'
    },
    switch:{
        alignSelf:'center'
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
    },

    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        alignSelf:"center",
        textAlign: 'center',
        marginBottom: '5%'
    },

    subHeader: {
        fontSize: 22,
        // alignSelf: 'center',
        margin: '5%',
        alignSelf:'center',
        textAlign: 'center'
    },

    detailText: {
        fontSize: 22,
        margin:'2%',
        alignSelf:'center',
        textAlign: 'center'
    },

    subText: {
        fontSize: 15,
        alignSelf: 'center',
        margin: '5%',
    },

    TextInput: {
        height: '5%',
        flex: 1,
        width: 200,
        paddingLeft: "6%",
    },

    resetTextInput: {
        height: '5%',
        width: 200,
        paddingLeft: "6%",
    }

});

export const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonRow:{
          flexDirection:'row',
          alignItems:'stretch',
          alignSelf:'center',
          justifyContent:'flex-end'
      },
      headerRow:{
          flexDirection:'row',
          alignItems:'stretch',
          alignSelf:'flex-start',
      },
      datePicker:{
          alignSelf:'center',
          marginHorizontal: '22%',
          flex:1
      }
});

export const profileStyles = StyleSheet.create({
    profilePic: {
        width: '30%',
        height: '20%',
        alignSelf:'center',
      },
      profileField: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '5%'
      },
      
});