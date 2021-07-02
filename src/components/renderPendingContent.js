import React, {useState, useEffect} from 'react'
import {View, SafeAreaView, Text, FlatList, TouchableOpacity} from 'react-native'
import { Avatar, ListItem, SearchBar } from 'react-native-elements'
import { INDUSTRY_CODES } from '../constants/objects'


export default function renderContent(props) {

  const [thing, setThing] = useState(0)
    const dateStringMaker = (date) => {
        return date.slice(0, 10)
    }
    const timeStringMaker = (date) => {
        return date.slice(16, 21)
      }
    let matchIDs = {}
    let item = props.item
    return (
        <ListItem
                      containerStyle={{borderBottomWidth:5, height: 110}}
                      key={props.index} 
                      roundAvatar>
                        <View style={{flexDirection: 'column', borderColor: '#000', paddingRight: '2.5%',borderRightWidth: 2}}>
                        <ListItem.Subtitle style={{fontWeight: '500'}}>{`${dateStringMaker(item.datetime)}`}</ListItem.Subtitle>
                        <ListItem.Subtitle style={{fontWeight: '300'}}>{`${timeStringMaker(item.datetime)}`}</ListItem.Subtitle>
                        </View>
                        <ListItem.Content>
                          <ListItem.Title style={{fontWeight: '500'}}>{`${INDUSTRY_CODES[item.otherUserIndustry]} Industry`}</ListItem.Title>
                          <ListItem.Title style={{fontWeight: '300'}}>{`${item.cuisinePreference} Cuisine`}</ListItem.Title>
                        </ListItem.Content>
                        <View style={{flexDirection: 'column'}}>
                          {!matchIDs[item.matchIDs] && 
                          <TouchableOpacity onPress={() => 
                            {
                              let newMatchIDs = Object(matchIDs)
                              newMatchIDs[item.matchIDs] = true
                            //   setMatchIDs(newMatchIDs)
                              console.log("change to true")
                              
                            }}>
                          <ListItem.Subtitle style={{color: 'green'}}>{`Accept`}</ListItem.Subtitle>
                          </TouchableOpacity>}
                          {!matchIDs[item.matchIDs] &&
                          <TouchableOpacity>
                          <ListItem.Subtitle style={{color: 'red'}}>{`Decline`}</ListItem.Subtitle>
                          </TouchableOpacity>}
                          {matchIDs[item.matchIDs] &&
                          <ListItem.Subtitle style={{color: 'green'}}>{`Accepted!`}</ListItem.Subtitle>
                          }
                          {matchIDs[item.matchIDs] &&
                          <TouchableOpacity onPress={() => 
                            {
                              let newMatchIDs = Object(matchIDs)
                              newMatchIDs[item.matchIDs] = false
                              console.log("change to false")
                            //   setMatchIDs(newMatchIDs)
                            }}>
                          <ListItem.Subtitle style={{color: 'red'}}>{`Unaccept`}</ListItem.Subtitle>
                          </TouchableOpacity>
                          }
                        </View>
                      </ListItem>
        )
}
