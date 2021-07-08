import firebase from 'firebase';
import { Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import {DIETARY_ARRAYS} from '../constants/objects'
import {firebaseDetails} from '../../FirebaseDetails'
import {CONFIRM_SUCCESS, CONFIRM_FAIL, FINAL_SUCCESS, 
  FINAL_FAIL, UNACCEPT_SUCCESS, UNACCEPT_FAIL, BLOCK_SUCCESS, 
  BLOCK_FAILURE, UNBLOCK_SUCCESS, UNBLOCK_FAILURE} from '../constants/results'

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
  deleteUser() {
    if(this.userExists()) {
      let updates = {}
        updates[`/Avatars/${this.uid}`] = null
        updates[`/Industry/${this.uid}`] = null
        updates[`/Users/${this.uid}`] = null
        updates[`ReportHistory/${this.uid}`] = null
        updates[`ComplaintCount/${this.uid}`] = null
        // Need to delete any awaiting requests he has or
        // set a this.userExists() condition in the matching
        // function
      firebase.database().update(updates)
      this
      .currentUser()
      .delete()
      .catch(err => console.log('delete user ' + err))
    }
  }


  deleteAnotherUser(otherUserId) {
    try {
      if(this.isAdmin()) {
        let updates = {}
        updates[`/Users/${otherUserId}`] = null;
        updates[`/Avatars/${otherUserId}`] = null;
        updates[`/Industry/${otherUserId}`] = null;
        return firebase.database().update(updates);
      } 
    } catch(err) {
      console.log("delete another user " + err);
    }
  }

  /**
   * Function to re-authenticate a user
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
   * Function to update user profile in Authentication database
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

  validateEmail = (user, success, failure) => firebase
                                                .auth()
                                                .fetchSignInMethodsForEmail(user.email)
                                                .then(success(user))
                                                .catch(failure)

  updateCurrentUserCollection = (user, success, failure) => {
    if (this.userExists()) {
      this
      .userRef(this.uid)
      .set(user)
      .then(success)
      .catch(failure);
      if (user == null) {
        this
        .industryRef(this.uid)
        .set(null);
        this
        .avatarRef(this.uid)
        .set(null);
      } else {
        this
        .industryRef(this.uid)
        .set(user.industry)
        this
        .avatarRef(this.uid)
        .set(user.avatar)
      }
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
   * Get all IDs of awaiting matches
   * @param {*} success 
   * @param {*} callback 
   * @param {*} failure 
   * @returns 
   */
  getAwaitingMatchIDs = (success, callback, failure) => this.userExists()
                                              ? this
                                                .userRef(`${this.uid}/awaitingMatchIDs`)
                                                .orderByChild('dietaryRestriction')
                                                .on('value', (x) => callback(success(x)))
                                              : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});
                                              
  awaitingMatchIDsOff = () => {if (this.userExists()){
                                this
                                .userRef(`${this.uid}/awaitingMatchIDs`)
                                .off()
                              }}                                            

  getPendingMatchIDs = (success, callback, failure) => this.userExists()
                                              ? this
                                                .userRef(`${this.uid}/pendingMatchIDs`)
                                                .on('value', (x) => callback(success(x)))
                                              : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});

   pendingMatchIDsOff = () => {if (this.userExists()){
                                this
                                .userRef(`${this.uid}/awaitingMatchIDs`)
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

  isAdmin() {
    return firebase
    .database()
    .ref(`ReportCount/${this.uid}`)
    .once("value")
    .then(snapshot => snapshot.val() != null)
  }

  getReports = (success, callback, failure) => 
  this.isAdmin()
  ? firebase
  .database()
  .ref(`Reports/${this.uid}`)
  .on('value', (x) => callback(success(x)))
  : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});

  getReportHistory(otherUserId, success, callback, failure) {
    this.isAdmin()
  ? firebase
  .database()
  .ref(`ReportHistory/${otherUserId}`)
  .on('value', (x) => callback(success(x)))
  : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});
  }

  reportHistoryOff = (otherUserId) => {
    if (this.isAdmin()) {
      firebase
      .database()
      .ref(`ReportHistory/${otherUserId}`)
      .off();
    }
  }
 

  reportsOff = () => {
                if (this.isAdmin()) {
                  firebase
                  .database()
                  .ref(`Reports/${this.uid}`)
                  .off();
                }
  }

  async getMinimumReportAdmin(otherUserId) {
    let admins;
    let sortedAdmins = [];
    let involvedParties = [this.uid, otherUserId]
    await firebase.database()
    .ref('ReportCount')
    .once("value", (snapshot) => {
      admins = snapshot.val()
    });
    let minimumReportAdmin = ['', 2000000];
    for (let admin in admins) {
      if(admins[admin] < minimumReportAdmin[1] && !involvedParties.includes(admin)) {
        minimumReportAdmin = [admin, admins[admin]];
      }
    }
    return minimumReportAdmin;
  }

  async getNumberOfComplaints(otherUserId) {
    let res; 
    await firebase.database().ref(`ComplaintCount/${otherUserId}`)
    .once("value", snapshot => snapshot.val() ? res = snapshot.val() : res = 0)
    return res;
  }

  async getDateJoined(otherUserId) {
    let res;
    await firebase.database().ref(`Users/${otherUserId}/dateJoined`)
    .once("value").then(snapshot => res = snapshot.val()).catch(err => console.log(err))
    return res;
  }

  async makeReport(otherUserId, complaint, datetime) {
    let updates = {}
    let minimumReportAdmin = await this.getMinimumReportAdmin();
    console.log(minimumReportAdmin)
    let numComplaints = await this.getNumberOfComplaints(otherUserId);
    let dateJoined = await this.getDateJoined(otherUserId)
    let key = await firebase.database().ref().push().key

    updates[`/Reports/${minimumReportAdmin[0]}/${key}`] = {complaint: complaint, datetime: datetime, plaintiff: this.uid, defendant: otherUserId, dateJoined: dateJoined, complaintCount: numComplaints+1}
    updates[`/ReportCount/${minimumReportAdmin[0]}`] = minimumReportAdmin[1]+1;
    updates[`/ComplaintCount/${otherUserId}`] = numComplaints+1;
    updates[`/ReportHistory/${otherUserId}/${key}`] = {complaint: complaint, datetime: datetime, plaintiff: this.uid, defendant: otherUserId}

    try {
      return firebase.database().ref().update(updates)
    } catch(err) {
      console.log("makeReport error: " + err)
    }
  }

  async getNumberOfReports() {
    let res;
    await firebase.database().ref(`/ReportCount/${this.uid}`)
    .once('value', snapshot => {
      res = snapshot.val()
    })
    return res;
  }

  async deleteReport(reportID) {
    let updates = {}
    let numReports = await this.getNumberOfReports()
    let x = numReports-1;
    updates[`/Reports/${this.uid}/${reportID}`] = null;
    updates[`/ReportCount/${this.uid}`] = x;
    try {
      await firebase.database().ref().update(updates);
    } catch(err) {
      console.log("delete report error " + err);
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
        const parsedMessage = {
          '_id': key,
          'user': value.user,
          'text': value.text,
          'timestamp': value.timestamp,
        };
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
    console.log(request)
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
   * @returns  Boolean depending on match found
   */
  async findGobbleMate(request) {
    console.log('Finding a match');
    console.log(request)
    let date1 = this.getDatetime(request)
    let ref = this.gobbleRequestsRef()
    .child(this.makeDateString(date1))
    //TODO: Stop users from entering matches with same datetime
    let tempRef;
    let coords1 = this.getCoords(request)
    let distance1 = this.getDistance(request)
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
      await tempRef.once("value").then(async(snapshot) => {//values in same day under dietaryOption
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
          let isBlocked1 = await this.isBlocked(request.userId, child.userId)
          let isBlocked2 = await this.isBlocked(child.userId, request.userId)
          let isBlocked = isBlocked1 || isBlocked2
          if(!this.isWithinRange(coords1, distance1, coords2, distance2) || 
          !this.isWithinTime(time1, time2) || isBlocked ||
          request.userId === child.userId) {
            console.log('out of range/time/same user/blocked');
            continue;
          }
          compatibility = await this.measureCompatibility(request, child) + this.measureCompatibility(child, request)
          console.log(compatibility, 'compatiblity');
          if (compatibility >= this.getThreshold()) {//for now threshold is 18 arbitrarily
            console.log('greater than threshold');
            await this.match(request, null, child, iterator)
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
   * Getter for user details
   * @param {*} id user id
   * @returns user object
   */
  async getUserDetails(id) {
    return this.getUserCollection(id, snapshot => snapshot.val(), err => console.log(err))
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
  updates[`/Users/${request.userId}/awaitingMatchIDs/${matchID}`] = {...request, matchID: matchID};
  updates[`/GobbleRequests/${this.makeDateString(date)}/${request.dietaryRestriction}/${matchID}`] = {...request, matchID: matchID};
  // Add more updates here
  firebase.database().ref().update(updates);
}

  /**
   * Handling database operations when two users match
   * @param {*} request1 request sent by first user
   * @param {*} dietaryRef1 Useful for scheduled functions - TODO for phase 3
   * @param {*} request2 request sent by second user
   * @param {*} request2Ref pending match ID of request2 in GobbleRequests and within the user object itself
   */
  async match(request1, request1Ref, request2, request2Ref) {
    let request2UserDetails = await this.getUserDetails(request2.userId)
    let request1UserDetails = await this.getUserDetails(request1.userId)
    const pendingMatchID = await this.gobbleRequestsRef().child('ANY').child('ANY').push().key;
    let updates = {}

    //The Match Updates
    updates[`/Users/${request1.userId}/pendingMatchIDs/${pendingMatchID}`] = {...request1, otherUserId: request2.userId, 
      otherUserCuisinePreference: request2.cuisinePreference, otherUserDietaryRestriction: request2UserDetails.diet, 
      otherUserDOB: request2UserDetails.dob, otherUserLocation: request2.location, otherUserIndustry: request2UserDetails.industry,
      otherUserAvatar: request2UserDetails.avatar, otherUserName: request2UserDetails.name, matchID: pendingMatchID, lastMessage:'',}
    updates[`/Users/${request2.userId}/pendingMatchIDs/${pendingMatchID}`] = {...request2, otherUserId: request1.userId,
      otherUserCuisinePreference: request1.cuisinePreference, otherUserDietaryRestriction: request1UserDetails.diet, 
      otherUserDOB: request1UserDetails.dob, otherUserLocation: request1.location, otherUserIndustry: request1UserDetails.industry, 
      otherUserAvatar: request1UserDetails.avatar, otherUserName: request1UserDetails.name, matchID: pendingMatchID, lastMessage:'',}

    //Remove Respective Pending Matches
    // updates[`/Users/${request2.userId}/awaitingMatchIDs/${request1Ref}`] = null;
    updates[`/Users/${request2.userId}/awaitingMatchIDs/${request2Ref}`] = null;

    // updates[`/GobbleRequests/${this.makeDateString(this.getDatetime(request1))}/${request1.dietaryRestriction}/${request1Ref}`] = null;
    updates[`/GobbleRequests/${this.makeDateString(this.getDatetime(request2))}/${request2.dietaryRestriction}/${request2Ref}`] = null;

    updates[`/PendingMatchIDs/${pendingMatchID}/${request1.userId}`] = false
    updates[`/PendingMatchIDs/${pendingMatchID}/${request2.userId}`] = false

    try{
      // console.log('Updates',updates);
      await firebase.database().ref().update(updates);
    } catch(err) {
      console.log('Match Update Error:', err.message);
    }
      // TODO: What if the user changes his/her profile picture?
      // Maybe we need to create another table of just user + profile pic so we don't need to load a lot of data every time
  }

  async matchConfirm(request) {
    let result;
    result = await firebase.database().ref(`/PendingMatchIDs/${request.matchID}/${request.otherUserId}`)
    .once("value")
    .then(snapshot => snapshot.val())
    if(result) {
      return this.matchFinalise(request)
    } else {
      let updates = {}
      updates[`/PendingMatchIDs/${request.matchID}/${request.userId}`] = true;
      try{
        // console.log('Updates',updates);
        await firebase.database().ref().update(updates);
        return CONFIRM_SUCCESS
      } catch(err) {
        console.log('Match Confirm Error:', err.message);
        return CONFIRM_FAIL
      }
    }
  }

  async matchDecline(request) {
    let updates = {}
    updates[`/Users/${request.userId}/pendingMatchIDs/${request.matchID}`] = null
    updates[`/Users/${request.otherUserId}/pendingMatchIDs/${request.matchID}`] = null
    updates[`/PendingMatchIDs/${request.matchID}`] = null
    try{
      // console.log('Updates',updates);

      await firebase.database().ref().update(updates);
    } catch(err) {   
      console.log('Match Confirm Error:', err.message);
    }

  }

  async matchUnaccept(request) {
      let updates = {}
      updates[`/PendingMatchIDs/${request.matchID}/${request.userId}`] = false;
      try{
        // console.log('Updates',updates);
        await firebase.database().ref().update(updates);
        return UNACCEPT_SUCCESS
      } catch(err) {
        console.log('Match Confirm Error:', err.message);
        return UNACCEPT_FAIL
      }
  }

  async matchFinalise(request) {
    let updates = {};
    let request2UserDetails = await this.getUserDetails(request.otherUserId)
    let request1UserDetails = await this.getUserDetails(request.userId)
    let otherUserRequest = await firebase.database().ref(`/Users/${request.otherUserId}/pendingMatchIDs/${request.matchID}`)
    .once("value")
    .then(snapshot => snapshot.val())

    updates[`/Users/${request.userId}/matchIDs/${request.matchID}`] = request
    updates[`/Users/${request.otherUserId}/matchIDs/${request.matchID}`] = otherUserRequest

    updates[`/PendingMatchIDs/${request.matchID}`] = null
    updates[`/Users/${request.userId}/pendingMatchIDs/${request.matchID}`] = null
    updates[`/Users/${request.otherUserId}/pendingMatchIDs/${request.matchID}`] = null
    updates = await this.linkChats(updates, request, otherUserRequest);


    try{
      // console.log('Updates',updates);
      await firebase.database().ref().update(updates);
      return FINAL_SUCCESS;
    } catch(err) {
      console.log('Match Confirm Error:', err.message);
      return FINAL_FAIL;
    }
  }


  
  async obtainStatusOfPendingMatch(matchID) {
    return firebase.database().ref(`/PendingMatchIDs/${matchID}/${this.uid}`)
    .once("value")
    .then(snapshot => snapshot.val())
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

  /**
   * Asynchronously create a chat for matched users
   */
  async linkChats(updates, req1, req2) {

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
                                                            name: req1.otherUserName,
                                                            avatar: req2.otherUserAvatar,
                                                            otherUserId: req2.userId,
                                                            industry: req2.industry,
                                                            otherUserAvatar: req1.otherUserAvatar,
                                                            lastMessage: '',
                                                            conversation: conversationID,
                                                            matchDateTime: req1.datetime,
                                                          };
        updates[`/Chats/${req2.userId}/${req1.userId}/metadata`] = {
                                                            _id: req2.userId,
                                                            name: req2.otherUserName,
                                                            avatar: req1.otherUserAvatar,
                                                            otherUserId: req1.userId,
                                                            industry: req1.industry,
                                                            otherUserAvatar: req2.otherUserAvatar,
                                                            lastMessage: '',
                                                            conversation: conversationID,
                                                            matchDateTime: req1.datetime,
                                                          };
      } else {
        updates[`/Chats/${req1.userId}/${req2.userId}/metadata/matchDateTime`] = req1.datetime;
        updates[`/Chats/${req2.userId}/${req1.userId}/metadata/matchDateTime`] = req1.datetime;
      }
    }
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

  async deleteAwaitingRequest(request) {
    let updates = {};
    updates[`/Users/${request.userId}/awaitingMatchIDs/${request.matchID}`] = null;
    let date = await this.getDatetime(request)
    updates[`/GobbleRequests/${this.makeDateString(date)}/${request.dietaryRestriction}/${request.matchID}`] = null;
    // Add more updates here
    try {
      await firebase.database().ref().update(updates);
    } catch(err) {
      console.log('Delete Awaiting Request Error: ' + err)
    }
  }

  async editAwaitingRequest(request) {
    let updates = {};
    updates[`/Users/${request.userId}/awaitingMatchIDs/${request.matchID}`] = null;
    let date = this.getDatetime(request)
    updates[`/GobbleRequests/${this.makeDateString(date)}/${request.dietaryRestriction}/${request.matchID}`] = null;
    // Add more updates here
    try {
      await firebase.database().ref().update(updates);
    } catch(err) {
      console.log('Delete Awaiting Request Error: ' + err)
    }
  }

  async getBlockedUsers2(uid) {
    return firebase.database().ref(`/Users/${uid}/blockedUsers`)
    .once("value")
    .then(snapshot => snapshot.val());
  }

  getBlockedUsers = (success, callback, failure) => this.userExists()
                                      ? firebase.database().ref(`Users/${this.uid}/blockedUsers`)
                                        .on('value', (x) => callback(success(x)))
                                      : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});

  

  
  removeBlockedUserPendingMatches(otherUid, pendingMatches) {
    let updates = {}
    for(let [key, value] of Object.entries(pendingMatches)) {
      let id = value['otherUserId']
      if(id == otherUid) {
        delete pendingMatches[key]
        console.log(key)
        updates[`/PendingMatchIDs/${key}`] = null;
        updates[`/Users/${otherUid}/pendingMatchIDs/${key}`] = null
      }
    }
    updates[`/Users/${this.uid}/pendingMatchIDs`] = pendingMatches
    firebase.database().ref().update(updates)
  }      
  
  removeBlockedUserMatches(otherUid, matches) {
    let updates = {}
    for(let [key, value] of Object.entries(matches)) {
      let id = value['otherUserId']
      if(id == otherUid) {
        delete matches[key]
        console.log(`/Users/${otherUid}/matchIDs/${key}`)
        updates[`/Users/${otherUid}/matchIDs/${key}`] = null
      }
    }
    updates[`/Users/${this.uid}/matchIDs`] = matches
    firebase.database().ref().update(updates)
  }
  blockUser(otherUid, otherUserNameAndAvatar) {
    let updates = {}
    return firebase.database().ref(`Users/${this.uid}/pendingMatchIDs`)
    .once("value")
    .then(snapshot => {
      if(snapshot.val()) {
        this.removeBlockedUserPendingMatches(otherUid, snapshot.val())
      }
      firebase.database().ref(`Users/${this.uid}/matchIDs`)
        .once("value")
        .then(subsnap => {
          if(subsnap.val()) {
            this.removeBlockedUserMatches(otherUid, subsnap.val())
          }
        })
        updates[`/Users/${this.uid}/blockedUsers/${otherUid}`] = otherUserNameAndAvatar;
        updates[`/Chats/${this.uid}/${otherUid}`] = null
        updates[`/Chats/${otherUid}/${this.uid}`] = null
        try {
          updates;
          firebase.database().ref().update(updates)
          return BLOCK_SUCCESS
        } catch(err) {
          console.log("Block user error: " + err)
          return BLOCK_FAILURE
        }
      }
    )
    // Deleting the chat and conversation + metadata

  }

  async isBlocked(uid, otherUid) {
    let x = false;
    x = await firebase.database().ref(`Users/${uid}/blockedUsers/${otherUid}`)
    .once("value")
    .then(snapshot => {
      return snapshot.val() ? true : false}
      )
    .catch(err => console.log(err)
    )
    return x;
  }

  async unblockUser(otherUid) {
    let updates = {}
    updates[`/Users/${this.uid}/blockedUsers/${otherUid}`] = null;
    try {
      await firebase.database().ref().update(updates)
      return UNBLOCK_SUCCESS
    } catch(err) {
      console.log("Block user error: " + err)
      return UNBLOCK_FAILURE
    }
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

  changeAvatar = async uri => {
    let newImage = await this.uploadImage(uri);
    let updates = {}
    updates[`/Users/${this.uid}/avatar`] = newImage
    updates[`/Avatars/${this.uid}`] = newImage
    try {
      await firebase.database().ref().update(updates)
    } catch (err) {
      console.log('changeimage error ' + err.message);
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