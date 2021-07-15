import firebase from 'firebase';
import { Alert } from 'react-native';
require('firebase/functions');
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
   * Used as a delete functionality.
   */
  deleteUser() {
    if(this.userExists()) {
      let updates = {}
        updates[`/Avatars/${this.uid}`] = null
        updates[`/Industry/${this.uid}`] = null
        updates[`/Users/${this.uid}`] = null
        updates[`ComplaintHistory/${this.uid}`] = null
        updates[`ComplaintCount/${this.uid}`] = null
        if(this.isAdmin()) {
          updates[`ReportCount/${this.uid}`] = null
        }
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

  addPushToken(pushToken) {
    this
    .currentUser()
    .getIdToken(true)
    .then(async idToken => {
      console.log("before func initial")
      const addPushTokenFunction = await firebase.functions().httpsCallable(`addPushTokenToDatabase`);
      console.log("after func initialisation")
      await addPushTokenFunction({idToken: idToken, pushToken: pushToken})
      .then(res => console.log(res.data.success, res.data.message)).catch(err =>{
        console.log(err);
        console.log('damnnnn')
      }
      );
    }).catch(err => {
      console.log("error!!")
      console.log(err)
    })
  }


  // deleteAnotherUser(otherUserId) {
  //   try {
  //     if(this.isAdmin()) {
  //       let updates = {}
  //       updates[`/Users/${otherUserId}`] = null;
  //       updates[`/Avatars/${otherUserId}`] = null;
  //       updates[`/Industry/${otherUserId}`] = null;
  //       return firebase.database().update(updates);
  //     } 
  //   } catch(err) {
  //     console.log("delete another user " + err);
  //   }
  // }
  async adminDeleteAnotherUser(otherUserId) {
    try {
      if(this.isAdmin()) {
        // let updates = {}
        // updates[`/Avatars/${otherUserId}`] = null;
        // updates[`/Industry/${otherUserId}`] = null;
        // firebase.database().update(updates);
        
        return this.currentUser().getIdToken(/* forceRefresh */ true).then(function(idToken) {
          console.log('Token: ', idToken);
          // Send token to your backend via HTTPS
          // ...
          const deleteFunction = firebase.functions().httpsCallable(`deleteUser`);
          console.log('UID:',otherUserId);
          return deleteFunction({uid: otherUserId, token:idToken})
          .then(result => {
            console.log('result of deletion: ', result);
            if (!result.data.success) {
              console.log('Delete Other User Failure: ' + result.data.message);
              return false;
            } else {
              console.log(result.data.message);
              return true;
            }
          })
          .catch(err => {
            console.log('DELETE OTHER USER ERROR: ', err.message);
            return false;
          });

        }).catch(function(error) {
          // Handle error
          console.log('TOKEN RETRIEVAL ERROR: ', error.message);
          return false;
        });
       
      } else {
        console.log('Not an Admin');
        return false;
      }
    } catch(err) {
      console.log("Delete another user failed: " , err.message);
      return false;
    }
  }

  async promoteCurrentUserToAdmin() {
    console.log('start');
    const promoteFunction = await firebase.functions().httpsCallable('promoteUserToAdmin');
    return await promoteFunction({uid: this.uid})
    .then(result => {
      console.log('Result: ', result);
      if (!result.data.success) {
        console.log('Promotion Failure', result.data.message);
        return result.data.message;
      } else {
        console.log(result.data.message);
        return result.data.message;
      }
    })
    .catch(err => {
      console.log('PROMOTION API CALL ERROR', err.message);
      return err.message;
    });
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

  isAdmin = () => {
    return firebase
    .database()
    .ref(`ReportCount/${this.uid}`)
    .once("value")
    .then(snapshot => snapshot.exists());
  }

  getReports = (success, callback, failure) => 
  this.isAdmin()
  ? firebase
  .database()
  .ref(`Reports/${this.uid}`)
  .on('value', (x) => callback(success(x)))
  : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});

  getComplaintHistory(otherUserId, success, callback, failure) {
    this.isAdmin()
  ? firebase
  .database()
  .ref(`ComplaintHistory/${otherUserId}`)
  .on('value', (x) => callback(success(x)))
  : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});
  }

  complaintHistoryOff = (otherUserId) => {
    if (this.isAdmin()) {
      firebase
      .database()
      .ref(`ComplaintHistory/${otherUserId}`)
      .off();
    }
  }
 

  reportsOff = () => {
                if (this.isAdmin()) {
                  firebase
                  .database()
                  .ref(`Reports`)
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
    let numComplaints = await this.getNumberOfComplaints(otherUserId);
    let dateJoined = await this.getDateJoined(otherUserId)
    let key = await firebase.database().ref().push().key

    updates[`/Reports/${minimumReportAdmin[0]}/${key}`] = {complaint: complaint, datetime: datetime, plaintiff: this.uid, defendant: otherUserId, dateJoined: dateJoined, complaintCount: numComplaints+1}
    updates[`/ReportCount/${minimumReportAdmin[0]}`] = minimumReportAdmin[1]+1;
    updates[`/ComplaintCount/${otherUserId}`] = numComplaints+1;
    updates[`/ComplaintHistory/${otherUserId}/${key}`] = {complaint: complaint, datetime: datetime, plaintiff: this.uid, defendant: otherUserId}

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
   * Converts the date object into a readable string
   * So that it can be stored in the database easily
   * @param {*} date Date object
   * @returns String of date
   */
  makeDateString(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  makeDateTimeString(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
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
   * Function called when user launches a request
   * to find a gobblemate
   * @param {*} match request sent by user searching for gobble
   * @returns  Boolean depending on match found
   */
  async findGobbleMate(request) {
    try {
      const findGobbleMateFunction = await firebase.functions().httpsCallable('findGobbleMate')
      console.log("err")
      let response = await findGobbleMateFunction({request: request})
      console.log('response', response)
      return response.data.found;
    } catch(err) {
      console.log('FindGobbleMate Error ' + err.message)
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

  async matchConfirm(request) {
    try {
      const matchConfirmFunction = await firebase.functions().httpsCallable('matchConfirm')
      let response = await matchConfirmFunction({request: request})
      return response.data.message;
    } catch(e) {
      console.log(e)
      return CONFIRM_FAIL
    }
  }

  async matchDecline(request) {
    try {
      return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const matchDeclineFunction = await firebase.functions().httpsCallable('matchDecline')
        let response = await matchDeclineFunction({request: request, idToken: idToken})
        return response.data.message;
      })
    } catch(e) {
      console.log('Match Confirm Error:', err.message);
    }
  }

  async matchUnaccept(request) {
    try{
      const matchUnacceptFunction = await firebase.functions().httpsCallable('matchUnaccept')
      let response = await matchUnacceptFunction({request: request})
      return response.data.message;
    } catch(e) {
      console.log('Match Unaccept Error:', err.message);
      return UNACCEPT_FAIL;
    }
  }

  async obtainStatusOfPendingMatch(matchID, datetime) {
    return firebase.database().ref(`/PendingMatchIDs/${this.makeDateString(new Date(datetime))}/${matchID}/${this.uid}`)
    .once("value")  
    .then(snapshot => snapshot.val())
  }

  async validateRequest(datetime, exemptedTime) {
    let existingRequestDatetimes;
    await firebase.database()
    .ref(`UserRequests/${this.uid}`)
    .on('value', (snapshot) => {
      existingRequestDatetimes = snapshot.val()
    })
    for(let key in existingRequestDatetimes) {
      let existingTime = existingRequestDatetimes[key]
      if(exemptedTime != null && exemptedTime == existingTime) {
        continue;
      }
      if(this.doesTimeClash(existingTime, datetime)) {
        return false;
      }
    }
    return true;
  }

  doesTimeClash(existingTime, datetime) {
    const ACCEPTABLE_TIME_DIFF = 7200000
    return Math.abs(new Date(existingTime) - new Date(datetime)) < ACCEPTABLE_TIME_DIFF
  }

  async deleteAwaitingRequest(request) {
    let updates = {};
    updates[`/Users/${request.userId}/awaitingMatchIDs/${request.matchID}`] = null;
    let dateString = this.makeDateString(this.getDatetime(request))
    let dateTimeString = await this.makeDateTimeString(this.getDatetime(request))
    updates[`/GobbleRequests/${dateString}/${request.dietaryRestriction}/${request.matchID}`] = null;
    updates[`/AwaitingPile/${dateTimeString}/${request.matchID}`] = null;
    updates[`/UserRequests/${request.userId}/${request.matchID}`] = null
    // Add more updates here
    try {
      await firebase.database().ref().update(updates);
    } catch(err) {
      console.log('Delete Awaiting Request Error: ' + err)
    }
  }

  getPendingTime(request) {
    return new Date(request['datetime'])
  }

  removeBlockedUserPendingMatches(otherUid, pendingMatches) {
    let updates = {}
    for(let [key, value] of Object.entries(pendingMatches)) {
      let id = value['otherUserId']
      if(id == otherUid) {
        delete pendingMatches[key]
        console.log(key)
        updates[`/PendingMatchIDs/${this.makeDateTimeString(this.getPendingTime(value))}/${key}`] = null;
        updates[`/Users/${otherUid}/pendingMatchIDs/${key}`] = null
        updates[`/UserRequests/${this.uid}/${key}`] = null
        updates[`/UserRequests/${otherUid}/${key}`] = null
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
        updates[`/Users/${otherUid}/matchIDs/${key}`] = null
        updates[`/UserRequests/${this.uid}/${key}`] = null
        updates[`/UserRequests/${otherUid}/${key}`] = null
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