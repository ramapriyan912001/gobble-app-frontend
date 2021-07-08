import React, { useState, useEffect } from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { View, Text } from 'react-native'
import { EMPTY_AVATAR } from '../constants/objects'
import { Ionicons } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../redux/actions/actions'
import { Avatar, ListItem, SearchBar } from 'react-native-elements'
import { API } from '../api'

function Restaurants(props) {

    const [match, setMatch] = useState(props.route.params.item)
    const [myLocation, setMyLocation] = useState({
        lat: props.route.params.item.location.coords.latitude,
        lng: props.route.params.item.location.coords.longitude,
    })
    const [otherUserLocation, setOtherUserLocation] = useState({
        lat: props.route.params.item.otherUserLocation.coords.latitude,
        lng: props.route.params.item.otherUserLocation.coords.longitude,
    })
    const [edited, setEdited] = useState(false);
    const [restaurantList, setRestaurantList] = useState([])
    const [mapFocusLocation, setMapFocusLocation] = useState({
        lat: props.route.params.item.location.coords.latitude,
        lng: props.route.params.item.location.coords.longitude,
    })
    
    function calculateDistance(coords1, coords2) {
        let lat1 = coords1['lat']
        let lat2 = coords2['lat']
        let lon1 = coords1['lng']
        let lon2 = coords2['lng']
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;
      
        const distance = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        return distance;
    }

    async function loadDataAsync() {
        let restaurants;
        if(restaurantList.length == 0) {
            let queryString = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
            let API_KEY = 'AIzaSyC6h4poHiCJzIWZGNZ5JThvwpTjk0q7eWo'
            queryString = queryString + `location=${myLocation.lat},${myLocation.lng}&`
            queryString = queryString + `radius=${match.distance*1000}&`
            queryString = queryString + `type=Restaurants&`
            queryString = queryString + `key=${API_KEY}`
            let data = await API.get(queryString);
                    //https://maps.googleapis.com/maps/api/place/nearbysearch/
                    //json?location=-33.8670522,151.1957362&
                    //radius=1500&
                    //type=restaurant&
                    //keyword=cruise&
                    //key=YOUR_API_KEY

            //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyC6h4poHiCJzIWZGNZ5JThvwpTjk0q7eWo
            restaurants = data.data.results;
            const otherUserDistance = match.otherUserDistance;
            // Filter restaurants such that they are within range of
            // the other user and are operational
            restaurants = await restaurants.filter(restaurant => {
                return (restaurant.business_status == 'OPERATIONAL') && (calculateDistance(restaurant.geometry.location,otherUserLocation) <= otherUserDistance+1)
            })

            //map the details to get rid of unnecessary data
            restaurants = await restaurants.map(restaurant => {
                return {place_id: restaurant.place_id, name: restaurant.name,
                    location:{latitude: restaurant.geometry.location.lat, longitude: restaurant.geometry.location.lng}}
            })
            setRestaurantList(restaurants)
        }
    }

    // {place_id: restaurant.place_id, name: restaurant.name, 
    //     rating: restaurant.rating, address: restaurant.vicinity, 
    //     opening_hours: restaurant.opening_hours, 
    //     location:{latitude: restaurant.geometry.location.lat, longitude: restaurant.geometry.location.lng},
    // }

    useEffect(() => {
        loadDataAsync();
    }, [restaurantList])

    useEffect(()=> {

    }, [mapFocusLocation])

    return (
        <View
         style={{
            flex: 1,
            backgroundColor: '#a0abff',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <MapView
                showsUserLocation
                style={{height: '100%', width: '100%'}}
                provider={PROVIDER_GOOGLE}
                onPress={() => {
                    console.log("press")
                }}
                initialRegion={{
                latitude: mapFocusLocation.lat,
                longitude: mapFocusLocation.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
            >
                {restaurantList.map((restaurant, index) => (
                        <Marker
                        key={index}
                        title={`${restaurant.name}`}
                        coordinate={restaurant.location}>
                            <Ionicons name='fast-food-sharp' size={22}></Ionicons>
                        </Marker>
                    )
                )}
            <Marker
            title='You'
            onPress={() => {
                
            }}
            coordinate={{latitude: myLocation.lat, longitude: myLocation.lng}}>
                <Avatar avatarStyle={{borderRadius: 120}} size="small" source={{uri:props.currentUserData.avatar}}/>
            </Marker>
            <Marker
            title={`${match.otherUserName}`}
            coordinate={{latitude: otherUserLocation.lat, longitude: otherUserLocation.lng}}>
                <Avatar avatarStyle={{borderRadius: 120}} size="small" source={{uri:match.otherUserAvatar}}/>
            </Marker>
            </MapView>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Restaurants);