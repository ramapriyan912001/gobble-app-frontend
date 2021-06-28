import firebase from 'firebase';
import { Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import {DIETARY_ARRAYS} from '../constants/objects'
import {firebaseDetails} from '../../FirebaseDetails'

/**
 * Class which operates as a database object, whose functions are
 * called for any and all CRUD operations. Backend logic is present
 * here as well, through the matching functions.
 * TODO: Migrate these operations to a separate backend repository
 */

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) { //avoid re-initializing -> HIDE LATER
      firebase.initializeApp(firebaseDetails);
     }
  }

  /**
   * Login to user account
   * @param {*} user User object containing all parameters of user
   * @param {*} success_callback 
   * @param {*} failed_callback Print error if failure occurs
   */
  login = async(user, success_callback, failed_callback) => {
      await firebase.auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback)
      .catch(failed_callback);
    }

  /**
   * Sign out of user account
   * @param {*} success Sign out of account
   * @param {*} failure Print error if failure occurs
   */
  signOut = (success, failure) => {
    firebase
    .auth()
    .signOut()
    .then(success)
    .catch(failure)
  };

  /**
   * For registration of new users
   * @param {*} user User object containing all parameters of user
   * @param {*} success 
   * @param {*} failure 
   */
  createUser = (user, success, failure) => {
    firebase
    .auth()
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(success)
    .catch(failure);//if create user with email and pw fails    
  }

  /**
   * Used in registration process in case user decides to quit
   * registration half way. Will also be used to implement delete
   * functionality.
   * @param {*} success 
   * @param {*} failure 
   */
  deleteUser = (success, failure) => {
    // let deletionSuccess = false;
    if (this.userExists()) {
      this
      .currentUser()
      .delete()
      .then(success)
      .catch(failure);
    } else {
      console.log('No User Found to Delete');
    }
  }

  /**
   * 
   * @param {*} user 
   * @param {*} success 
   * @param {*} failure 
   */
  reauthenticateUser = (user, success, failure) => {
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, user.password);
    if (this.userExists()) {
      this
      .currentUser()
      .reauthenticateWithCredential(credentials)
      .then(success)
      .catch(failure);
    } else {
      failure({code: 'auth/no-user', message: 'No User Exists'});
    }
  }

  /**
   * 
   * @param {*} user 
   * @param {*} success 
   * @param {*} failure 
   */
  updateUserProfile = (user, success, failure) => {
    if (this.userExists()) {
      this
      .currentUser()
      .updateProfile(user)
      .then(success)
      .catch(failure);
    }
  }

  updateEmail = (email, success, failure) => {
    if (this.userExists()) {
      this
      .currentUser()
      .updateEmail(email)
      .then(success)
      .catch(failure);
    }
  };

  updateCurrentUserCollection = (user, success, failure) => {
    if (this.userExists()) {
      this
      .userRef(this.uid)
      .set(user)
      .then(success)
      .catch(failure);
      this
      .industryRef(this.uid)
      .set(user.industry)
      this
      .avatarRef(this.uid)
      .set(user.avatar)
    } else {
      console.log('No User Logged In');
    }
    // Scalable multiple update method
    //
    // const newUserKey = firebase.database().ref().child('Users/').key;
    // let updates = {};
    // updates['/Users/'+ uid + '/' + newUserKey] = userProfile;
    // // Add more updates here
    // return firebase.database().ref().update(updates);
  }

  getCurrentUserCollection = (success, failure) => this.userExists()
                                                    ? this
                                                      .userRef(this.uid)
                                                      .once('value')
                                                      .then(success)
                                                      .catch(failure)
                                                    : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});

  getUserCollection = (id, success, failure) => id != null
                                                ? this
                                                  .userRef(id)
                                                  .once('value')
                                                  .then(success)
                                                  .catch(failure)
                                                : failure({code: 'auth/invalid-id', message: 'Invalid UID provided'});


  /**
   * Get all IDs of pending matches
   * @param {*} success 
   * @param {*} callback 
   * @param {*} failure 
   * @returns 
   */
  getPendingMatchIDs = (success, callback, failure) => this.userExists()
                                              ? this
                                                .userRef(`${this.uid}/pendingMatchIDs`)
                                                .on('value', (x) => callback(success(x)))
                                              : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});

  pendingMatchIDsOff = () => {if (this.userExists()){
                                this
                                .userRef(`${this.uid}/pendingMatchIDs`)
                                .off()
                              }}
  
   
                                
  getMatchIDs = (success, callback, failure) => this.userExists()
                                      ? this
                                        .userRef(`${this.uid}/matchIDs`)
                                        .on('value', (x) => callback(success(x)))
                                      : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});

  matchIDsOff = () => {
                        if (this.userExists()) {
                          this
                          .userRef(`${this.uid}/matchIDs`)
                          .off()
                      }}
  
  getChats = (success, failure) => this.userExists()
                                      ? this  
                                        .chatsRef(`${this.uid}`)
                                        .on('value', success)
                                      : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});  
  
  chatsOff = () => {
                      if (this.userExists()) {
                        this
                        .chatsRef(`${this.uid}`)
                        .off();
                    }
                  }

  /**
   * Getter for current user
   * @returns current user
   */                
  currentUser = () => firebase.auth().currentUser;

  /**
   * Check to see if the user exists
   * @returns boolean 
   */
  userExists = () => this.currentUser() != null;

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('User has Logged In');
      } else {
        console.log('User has Logged Out');
      }
    });

  //Retrieve All Stored Messages
  messageRefRetrieve = (id, callback) => {
    // console.log('Retrieving Old Messages: ');
    this.conversationRef(`${id}`)
      // .limitToLast(40)
      .on('value', snapshot => callback(this.parseStoredMessage(snapshot)));
  }

  // messageRefOn = callback => {
  //   // console.log('New Message: ');
  //   this.conversationRef('')
  //     .limitToLast(40)
  //     .on('child_added', snapshot => callback(this.parseMessage(snapshot)));
  // }

  messageRefOff(id) {
    this.conversationRef(`${id}`).off();
  }

  // The parse method take the snapshot data and construct a message:
  parseMessage = snapshot => {
    const message = snapshot.val();
    const { timestamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const parsedMessage = {_id, timestamp, text, user};
    return parsedMessage;
  };

  parseStoredMessage = snapshot => {
    const messageArray = snapshot.val();
    let parsedMessageArray = [];
    if (messageArray == null) {
      //Do Nothing
    } else {
      for (let [key, value] of Object.entries(messageArray)) {
        // console.log('here');
        // console.log(value);
        const parsedMessage = {
          '_id': key,
          'user': value.user,
          'text': value.text,
          'timestamp': value.timestamp,
        };
        // console.log(parsedMessage);
        parsedMessageArray.unshift(parsedMessage);
      }
    }
    return parsedMessageArray;
  };

  /**
   * Functionality for resetting password
   * @param {*} email ID to which password reset email is sent
   * @param {*} success 
   * @param {*} failure Print error if failure occurs
   * @returns 
   */
  resetPassword = (email, success, failure) =>
    firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(success)
    .catch(failure);

  // To send a message, we call the send method from GiftedChat component in onSend property as such: onSend={firebaseSvc.send}
  // The send method in Firebase.js is:
  send = (id, otherUserID, messages) => {
    const len = messages.length;
    const lastSentMessage = len == 0 ? '' : messages[len - 1];
    messages.map((message) => {
      const {text, user, createdAt} = message;
      const timestamp = createdAt.toDateString();
      const newMessage = {text, user, timestamp};
      this.conversationRef(`${id}`).push(newMessage);
    });
    //Change lastMessage of Match - switch to Chats Table
    // this.userRef(`/${this.uid}/matchIDs/${id}/lastMessage`).set(lastSentMessage);
    this.chatsRef(`/${this.uid}/${otherUserID}/metadata/lastMessage`).set(lastSentMessage.text);
    this.chatsRef(`/${otherUserID}/${this.uid}/metadata/lastMessage`).set(lastSentMessage.text);

    // const changeLastMessage = (user) => {user.matchIDs[id][lastMessage] = lastSentMessage;};
    // this.getCurrentUserCollection(changeLastMessage, (err) => console.log('Error Changing Last Message', err.message));
  };
  
  /**
   * Getter for user ID
   */
  get uid() {
    return this.currentUser().uid;
  }
  
  /**
   * Get the reference to chat object within the conversation object within the database
   * @param {*} params id of object
   * @returns reference
   */
  conversationRef(params) {
    return firebase.database().ref(`Conversation/${params}`);
  }

  /**
   * Get the reference to user object within the users object within the database
   * @param {*} params id of object
   * @returns reference
   */
  userRef(params) {
    return firebase.database().ref(`Users/${params}`);
  }

  /**
   * Get the reference to object within the chats object within the database
   * @param {*} params id of object
   * @returns reference
   */
  chatsRef(params) {
    return firebase.database().ref(`Chats/${params}`);
  }

  /**
   * Get the reference to object within the matches object within the database
   * @param {*} params id of object
   * @returns reference
   */
  matchesRef(params) {
    return firebase.database().ref(`Matches/${params}`);
  }

  /**
   * Get the reference to object within the GobbleRequests object within the database
   * @param {*} params id of object
   * @returns reference
   */
  gobbleRequestsRef() {
    return firebase.database().ref(`GobbleRequests`)
  }

  /**
   * Converts the date object into a readable string
   * So that it can be stored in the database easily
   * @param {*} date Date object
   * @returns String of date
   */
  makeDateString(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  /**
   * Get coordinates of the user's location
   * @param {*} request match request sent by user searching for gobble
   * @returns 
   */
  getCoords(request) {
    return request['location']['coords']
  }

  /**
   * Get datetime string from request sent by user
   * @param {*} request match request sent by user searching for gobble
   * @returns 
   */
  getDatetime(request) {
    return new Date(request['datetime'])
  }

  /**
   * Get preferred distance for meal from request sent by user
   * @param {*} request match request sent by user searching for gobble
   * @returns 
   */
  getDistance(request) {
    return request['distance']
  }

  /**
   * Convert time into minutes to easily evaluate time difference
   * @param {*} date date object
   * @returns 
   */
  convertTimeToMinutes(date) {
    return date.getHours()*60 + date.getMinutes()
  }

  /**
   * Function called when user launches a request
   * to find a gobblemate
   * @param {*} match request sent by user searching for gobble
   * @returns  
   */
  async findGobbleMate(gobbleRequest) {
    console.log('Finding a match');
    let request = gobbleRequest;
    let datetime = this.getDatetime(gobbleRequest)
    let date = new Date(datetime)
    let ref = this.gobbleRequestsRef()
    .child(this.makeDateString(date))
    //TODO: Stop users from entering matches with same datetime
    let tempRef;
    let coords1 = this.getCoords(request)
    let distance1 = this.getDistance(request)
    let date1 = this.getDatetime(request)
    let time1 = this.convertTimeToMinutes(date1)
    let bestMatch = null;
    let bestMatchCompatibility = 5;
    let dietaryRef;
    let counter = 0;
    let dietaryOptionsArray = DIETARY_ARRAYS[`${request.dietaryRestriction}`]
    let requestRef2;
    let result = false;
    // IF THE USER IS ANY, WE NEED TO SEARCH ALL THE PENDING REQUESTS
    for(;counter < dietaryOptionsArray.length; counter++) {
      const dietaryOption = dietaryOptionsArray[counter];
      console.log('looking through ' + dietaryOption);
      tempRef = ref.child(`${dietaryOption}`);
      await tempRef.once("value").then(snapshot => {//values in same day under dietaryOption
        let iterator, child;
        let time2, coords2, distance2, date2;
        let children = snapshot.val()
        let compatibility
        for(iterator in children) {//iterate through these values
          child = children[iterator]
          coords2 = this.getCoords(child)
          distance2 = this.getDistance(child)
          date2 = this.getDatetime(child)
          time2 = this.convertTimeToMinutes(date2)
          if(!this.isWithinRange(coords1, distance1, coords2, distance2) || !this.isWithinTime(time1, time2) || request.userId === child.userId) {
            console.log('out of range/time/ same user');
            continue;
          }
          compatibility = this.measureCompatibility(request, child) + this.measureCompatibility(child, request)
          console.log(compatibility, 'compatiblity');
          if (compatibility >= this.getThreshold()) {//for now threshold is 18 arbitrarily
            console.log('greater than threshold');
            this.match(request, null, child, iterator)
            result = true;
            console.log("EARLY TERMINATION")
            break;
          } else if (compatibility > bestMatchCompatibility) {
            console.log('new best compatibility');
            bestMatchCompatibility = compatibility
            bestMatch = child;
            dietaryRef = iterator; 
          }
        }
      })
      if(result) {
        return true;
      }
    }
    if (counter === dietaryOptionsArray.length) {
        if (bestMatch != null) {
          console.log("AT THE END OF LOOP")
          this.match(request, null, bestMatch, dietaryRef)
          return true;
        } else {
          console.log('No match found! Creating new entry');
          this.makeGobbleRequest(ref, request, date1)
          return false;
        }
    }
}

/**
 * Function called when match is not instantly found
 * Pending match ID generated and added to the pile
 * @param {*} ref Reference of date object within GobbleRequests object
 * @param {*} request Request sent by user searching for gobble
 * @param {*} date Date object of request
 */
makeGobbleRequest(ref, request, date) {
  const matchID = ref.child(`${request.dietaryRestriction}`).push().key;
  let updates = {};
  updates[`/Users/${request.userId}/pendingMatchIDs/${matchID}`] = request;
  updates[`/GobbleRequests/${this.makeDateString(date)}/${request.dietaryRestriction}/${matchID}`] = request;
  // Add more updates here
  firebase.database().ref().update(updates);
}

  /**
   * Getter for user details
   * @param {*} id user id
   * @returns user object
   */
  async getUserDetails(id) {
    return this.getUserCollection(id, snapshot => snapshot.val(), err => console.log(err))
  }

  /**
   * Handling database operations when two users match
   * @param {*} request1 request sent by first user
   * @param {*} dietaryRef1 Useful for scheduled functions - TODO for phase 3
   * @param {*} request2 request sent by second user
   * @param {*} request2Ref pending match ID of request2 in GobbleRequests and within the user object itself
   */
  async match(request1, dietaryRef1, request2, request2Ref) {
    let request2UserDetails = await this.getUserDetails(request2.userId)
    let request1UserDetails = await this.getUserDetails(request1.userId)
    const matchID = await this.gobbleRequestsRef().child('ANY').child('ANY').push().key;
    let updates = {}

    //The Match Updates
    updates[`/Users/${request1.userId}/matchIDs/${matchID}`] = {...request1, otherUserId: request2.userId, 
      otherUserCuisinePreference: request2.cuisinePreference, otherUserDietaryRestriction: request2UserDetails.diet, 
      otherUserDOB: request2UserDetails.dob, otherUserLocation: request2.location, otherUserIndustry: request2UserDetails.industry,
      otherUserAvatar: request1UserDetails.avatar, otherUserName: request2UserDetails.name, matchID: matchID, lastMessage:'',}
    updates[`/Users/${request2.userId}/matchIDs/${matchID}`] = {...request2, otherUserId: request1.userId,
      otherUserCuisinePreference: request1.cuisinePreference, otherUserDietaryRestriction: request1UserDetails.diet, 
      otherUserDOB: request1UserDetails.dob, otherUserLocation: request1.location, otherUserIndustry: request1UserDetails.industry, 
      otherUserAvatar: request1UserDetails.avatar, otherUserName: request1UserDetails.name, matchID: matchID, lastMessage:'',}

    //Remove Respective Pending Matches
    updates[`/Users/${request2.userId}/pendingMatchIDs/${request2Ref}`] = null;
    updates[`/GobbleRequests/${this.makeDateString(this.getDatetime(request2))}/${request2.dietaryRestriction}/${request2Ref}`] = null;

    updates = await this.linkChats(updates, request1, request2, request1UserDetails, request2UserDetails);
    try{
      // console.log('Updates',updates);
      await firebase.database().ref().update(updates);
    } catch(err) {
      console.log('Match Update Error:', err.message);
    }
      // TODO: What if the user changes his/her profile picture?
      // Maybe we need to create another table of just user + profile pic so we don't need to load a lot of data every time
  }

  /**
   * Threshold for when matching algorithm can stop and return
   * This is supposed to be dynamic
   * Will be improved in phase 3
   * @param {*} request request sent by user
   * @returns a score number value
   */
  getThreshold(request) {
    // Will have a threshold function to mark how low a score we are willing to accept for a match
    // Nearer to the schedule time, the lower the threshold
    // This is for milestone 3
    // For now we just have a threshold of 18 points
    return 18;
  }

  async linkChats(updates, req1, req2, user1, user2) {
    //Adding to Chats Table
    //If the User has never been matched before, add a new entry in each User's ref under this table
    //If they have been matched before, update matchDateTime
    let isNewMatch = false;
    await this.chatsRef(`${req1.userId}/${req2.userId}`)
                          .once('value', snapshot => {isNewMatch = !snapshot.exists()});
    console.log(isNewMatch, 'BOOL');
    if (isNewMatch == null){
      //Do Nothing
      console.log('Nothing is done to link chats');
    } else { 
      if (isNewMatch) {
        const conversationID = await this.conversationRef().push().key;  
        updates[`/Chats/${req1.userId}/${req2.userId}/metadata`] = {
                                                            _id: req1.userId,
                                                            name: user2.name,
                                                            otherUserId: req2.userId,
                                                            industry: req2.industry,
                                                            avatar: user2.avatar,
                                                            lastMessage: '',
                                                            conversation: conversationID,
                                                            matchDateTime: req1.datetime,
                                                          };
        updates[`/Chats/${req2.userId}/${req1.userId}/metadata`] = {
                                                            _id: req2.userId,
                                                            name: user1.name,
                                                            otherUserId: req1.userId,
                                                            industry: req1.industry,
                                                            avatar: user1.avatar,
                                                            lastMessage: '',
                                                            conversation: conversationID,
                                                            matchDateTime: req1.datetime,
                                                          };
      } else {
        updates[`/Chats/${req1.userId}/${req2.userId}/metadata/matchDateTime`] = req1.datetime;
        updates[`/Chats/${req2.userId}/${req1.userId}/metadata/matchDateTime`] = req1.datetime;
      }
    }
    console.log(updates)
    return updates;
          // .then (x => x)
          // .catch(err => console.log('Linking Chats Error:', err.message));
  }

  /**
   * Function to measure compatibility between users when 
   * deciding whether or not to match users
   * @param {*} request1 request sent by one user
   * @param {*} request2 request sent by other user
   * @returns a score number value
   */
  measureCompatibility(request1, request2) {
    let compatibility = 0;
    if(request1.cuisinePreference == request2.cuisinePreference) {
      compatibility += 5;
    }
    if(request1.industryPreference == 12 || (request1.industryPreference == request2.industry)) {
      compatibility += 5;
    }
    return compatibility;
  }

  /**
   * Calculate distance between two users using coordinates provided
   * @param {*} coords1 coordinates of first user's location
   * @param {*} coords2 coordinates of second user's location
   * @returns the distance between the two users via a number value
   */
  calculateDistance(coords1, coords2) {
    let lat1 = coords1['latitude']
    let lat2 = coords2['latitude']
    let lon1 = coords1['longitude']
    let lon2 = coords2['longitude']
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    const distance = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    return distance;
  }

  /**
   * Evaluates if two users are within range of each other for a match to ocurr
   * @param {*} coords1 coordinates of first user's location
   * @param {*} distance1 distance willing to be travelled by first user
   * @param {*} coords2 coordinates of second user's location
   * @param {*} distance2 distance willing to be travelled by second user
   * @returns boolean
   */
  isWithinRange(coords1, distance1, coords2, distance2) {//was Bug
    return (distance1 + distance2) >= this.calculateDistance(coords1, coords2)
  }

  /**
   * Evaluates if two users are compatible based on their match times
   * @param {*} time1 Preferred time of first user request
   * @param {*} time2 Preferred time of second user request
   * @returns Boolean
   */
  isWithinTime(time1, time2) {
    return (Math.abs(time1-time2) <= 30)   
  }

  /**
   * Getter for timestamp of when item was added to database
   */
  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  //Upload Image to Firebase Storage
  uploadImage = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase.storage().ref('avatar').child(uuid());
      const task = ref.put(blob);
      return new Promise((resolve, reject) => {
        task.on('state_changed', () => { }, reject, 
          () => resolve(task.snapshot.ref.getDownloadURL()));
      });
    } catch (err) {
      console.log('uploadImage error: ' + err.message); 
    }
  }

  updateAvatar = (url) => {
    //await this.setState({ avatar: url });
    let userf = this.currentUser();
    if (this.userExists()) {
      userf.updateProfile({photoURL: url, avatar: url})
      .then(() => console.log("Updated avatar successfully. URL:" + url))
      .catch((error) => {
        console.log("Avatar Update Error: " + error.message);
        Alert.alert("Error updating avatar. " + error.message);
      });
    } else {
      console.log("can't update avatar, user is not logged in.");
      Alert.alert("Unable to update avatar. You must re-authenticate first.");
      props.navigation.navigate('Reauthentication');
    }
  }

  /**
   * Reference to string under user object within industry object in database
   * @param {*} params user id
   * @returns Reference
   */
  industryRef(params) {
    return firebase.database().ref(`Industry/${params}`)
  }

  /**
   * Reference to string under user object within avatar object in database
   * @param {*} params user id
   * @returns Reference
   */
  avatarRef(params) {
    return firebase.database().ref(`Avatars/${params}`)
  }

}
// To apply the default browser preference instead of explicitly setting it.
// firebase.auth().useDeviceLanguage();
// firebase.auth().languageCode = 'de';

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;