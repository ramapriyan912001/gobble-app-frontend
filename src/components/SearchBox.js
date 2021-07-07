import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import {useNavigation} from '@react-navigation/native'

export default function SearchBox(props) {
  const navigation = useNavigation();

  const goToSearch = () => {
    navigation.navigate('search')
  }

  return (
    <View>
      {/*  Input Box */}
      <Pressable onPress={goToSearch} style={styles.inputBox}>
        <Text style={styles.inputText}>Where will you be?</Text>

        <View style={styles.timeContainer}>
          <AntDesign name={'clockcircle'} size={16} color={'#535353'} />
          <Text>Now</Text>
          <MaterialIcons name={'keyboard-arrow-down'} size={16} />
        </View>
      </Pressable>

      {/* Previous destination */}
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <AntDesign name={'clockcircle'} size={20} color={'#ffffff'} />
        </View>
        <Text style={styles.destinationText}>Office</Text>
      </View>

      {/* Home destination */}
      <View style={styles.row}>
        <View style={[styles.iconContainer, {backgroundColor: '#218cff'}]}>
          <Entypo name={'home'} size={20} color={'#ffffff'} />
        </View>
        <Text style={styles.destinationText}>Home</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    inputBox: {
      backgroundColor: '#e7e7e7',
      margin: 5,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: Dimensions.get('window').width
    },
    inputText: {
      fontSize: 20,
      fontWeight: '600',
      color: '#434343',
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 100,
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 50
    },
  
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderColor: '#dbdbdb',
    },
    iconContainer: {
      backgroundColor: '#b3b3b3',
      padding: 10,
      borderRadius: 25,
    },
    destinationText: {
      marginLeft: 10,
      fontWeight: '500',
      fontSize: 16,
    },
  });