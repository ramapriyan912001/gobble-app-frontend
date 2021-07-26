// import firebase from 'firebase';
import { Alert } from 'react-native';
require('firebase/functions');
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import {DIETARY_ARRAYS} from '../constants/objects'
import firebase from '../../FirebaseDetails'
import {CONFIRM_SUCCESS, CONFIRM_FAIL, FINAL_SUCCESS, 
  FINAL_FAIL, UNACCEPT_SUCCESS, UNACCEPT_FAIL, BLOCK_SUCCESS, 
  BLOCK_FAILURE, UNBLOCK_SUCCESS, UNBLOCK_FAILURE, DELETE_REQUEST_SUCCESS, DELETE_REQUEST_FAILURE, MAKE_REPORT_FAILURE, DELETE_ACCOUNT_FAILURE} from '../constants/results'

/**
 * Class which operates as a database object, whose functions are
 * called for any and all CRUD operations. Backend logic is present
 * here as well, through the matching functions.
 * TODO: Migrate these operations to a separate backend repository
 */

class FirebaseSvc {
  constructor() {
    
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
    try {
      return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const deleteAccountFunction = await firebase.functions().httpsCallable('deleteAccount')
        let response = await deleteAccountFunction({uid: this.uid, idToken: idToken})
        console.log(response.data.message)
        return response.data.success;
      })
    } catch(err) {
      console.log('Delete User Error:', err.message);
      return false;
    }
  }

  addPushToken(pushToken) {
    try {
      return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const addPushTokenFunction = await firebase.functions().httpsCallable('addPushTokenToDatabase')
        let response = await addPushTokenFunction({pushToken: pushToken, idToken: idToken})
        return response.data.success;
      })
    } catch(err) {
      console.log('Add PushToken Error:', err.message);
      return false;
    }
  }

  async adminDeleteAnotherUser(otherUserId) {
    try {
      if(this.isAdmin()) {  
        return this.currentUser().getIdToken(/* forceRefresh */ true).then(function(idToken) {
          console.log('Token: ', idToken);
          // Send token to your backend via HTTPS
          // ...
          const deleteFunction = firebase.functions().httpsCallable(`deleteUser`);
          console.log('UID:',otherUserId);
          return deleteFunction({uid: otherUserId, token:idToken})
          .then(result => {
            // console.log('result of deletion: ', result);
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
                                              
  awaitingMatchIDsOff = (uid) => this
                              .userRef(`${uid}/awaitingMatchIDs`)
                              .off()                                    

  getPendingMatchIDs = (success, callback, failure) => this.userExists()
                                              ? this
                                                .userRef(`${this.uid}/pendingMatchIDs`)
                                                .on('value', (x) => callback(success(x)))
                                              : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});

   pendingMatchIDsOff = (uid) =>  this
                                  .userRef(`${uid}/pendingMatchIDs`)
                                  .off();                                         
                                
  getMatchIDs = (success, callback, failure) => this.userExists()
                                      ? this
                                        .userRef(`${this.uid}/matchIDs`)
                                        .on('value', (x) => callback(success(x)))
                                      : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});

  matchIDsOff = (uid) => this
                        .userRef(`${uid}/matchIDs`)
                        .off();
  
  getChats = (success, failure) => this.userExists()
                                      ? this  
                                        .chatsRef(`${this.uid}`)
                                        .on('value', success)
                                      : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});  
  
  chatsOff = (uid) => this
                      .chatsRef(`${uid}`)
                      .off();

  isAuthAdmin = () => {
    return this
            .currentUser()
            .getIdTokenResult()
            .then(idTokenResult => (!!idTokenResult.claims.admin))
            .catch(err => {
              console.log(err.message);
              return false;
            });
  };

  isAdmin = () => {
    return (
      this.isAuthAdmin()  
      )||(
      firebase
      .database()
      .ref(`ReportCount/${this.uid}`)
      .once("value")
      .then(snapshot => snapshot.exists())
    );
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
 

  reportsOff = (uid) => firebase
                      .database()
                      .ref(`Reports/${uid}`)
                      .off();

  async makeReport(otherUserId, complaint, datetime) {
    try {
      return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const makeReportFunction = await firebase.functions().httpsCallable('makeReport')
        let response = await makeReportFunction({otherUserId: otherUserId, complaint: complaint, 
          datetime: datetime, idToken: idToken})
        return response.data.message;
      })
    } catch(err) {
      console.log('Make Report Error:', err.message);
      return MAKE_REPORT_FAILURE;
    }
  }

  async deleteReport(reportID) {
    try {
      return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const deleteReportFunction = await firebase.functions().httpsCallable('deleteReport')
        let response = await deleteReportFunction({reportID: reportID, idToken: idToken})
        return response.data.message;
      })
    } catch(err) {
      console.log('Delete Report Error:', err.message);
      return DELETE_REPORT_FAILURE;
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
  // parseMessage = snapshot => {
  //   const message = snapshot.val();
  //   const { timestamp, text, user } = snapshot.val();
  //   const { key: _id } = snapshot;
  //   const parsedMessage = {_id, timestamp, text, user};
  //   return parsedMessage;
  // };

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

    //Send a Notification to the Other User
    this.currentUser().getIdToken(true)
    .then(idToken => {
      firebase
      .functions()
      .httpsCallable('sendMessageNotif')({
        otherUserID: otherUserID,
        text: lastSentMessage.text, 
        idToken: idToken})
      .then(response => {
        console.log(response);
        if (!response.data.success) {
          console.log('Last Message not delivered');
        }
      })
      .catch(err => {
        console.log(`Message Notif Error: ${err.message}`);
      });
    })
    .catch(err => console.log('Message Get ID Token Error: ', err.message));
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
    return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const findGobbleMateFunction = await firebase.functions().httpsCallable('findGobbleMate');
        console.log('Looking for a Match');
        let response = await findGobbleMateFunction({request: request, idToken: idToken})
        console.log('response', response)
        return response.data.found;
      })
      .catch(err => {
        console.log('FINDGOBBLEMATE FUNCTION RETRIEVAL/EXECUTION ERROR: ', err.message);
        return false;
      })
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
      return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const matchConfirmFunction = await firebase.functions().httpsCallable('matchConfirm')
        let response = await matchConfirmFunction({request: request, idToken: idToken})
        return response.data.message;
      })
      .catch(err => {
        console.log('MATCHCONFIRM ERROR:', err.message);
        return CONFIRM_FAIL;
      })
    } catch(e) {
      console.log(e)
      return CONFIRM_FAIL;
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
    } catch(err) {
      console.log('Match Decline Error:', err.message);
    }
  }

  async matchUnaccept(request) {
    try{
      return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const matchUnacceptFunction = await firebase.functions().httpsCallable('matchUnaccept')
        let response = await matchUnacceptFunction({request: request, idToken: idToken})
        return response.data.message;
      })
    } catch(err) {
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
    try {
      return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const deleteAwaitingRequestFunction = await firebase.functions().httpsCallable('deleteAwaitingRequest')
        let response = await deleteAwaitingRequestFunction({request: request, idToken: idToken})
        console.log(response)
        return response.data.message;
      })
    } catch(err) {
      console.log('Match Confirm Error:', err.message);
      return DELETE_REQUEST_FAILURE
    }
  }

  getPendingTime(request) {
    return new Date(request['datetime'])
  }

  getBlockedUsers = (success, callback, failure) => this.userExists()
                                                    ? this
                                                      .userRef(`${this.uid}/blockedUsers`)
                                                      .on('value', (x) => callback(success(x)))
                                                    : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Login'});

  blockedUsersOff(uid) {
    this.userRef(`${uid}`).off();
  }

  blockUser(otherUid, otherUserNameAndAvatar) {
    try {
      return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const blockUserFunction = await firebase.functions().httpsCallable('blockUser')
        let response = await blockUserFunction({otherUid: otherUid, idToken: idToken, otherUserNameAndAvatar: otherUserNameAndAvatar})
        console.log(response)
        return response.data.message;
      })
    } catch(err) {
      console.log('Block User Error:', err.message);
      return BLOCK_FAILURE;
    }
  }

  async unblockUser(otherUid) {
    try {
      return firebase
      .auth()
      .currentUser
      .getIdToken(true)
      .then(async idToken => {
        const unblockUserFunction = await firebase.functions().httpsCallable('unblockUser')
        let response = await unblockUserFunction({otherUid: otherUid, idToken: idToken})
        return response.data.message;
      })
    } catch(err) {
      console.log('Unblock User Error:', err.message);
      return UNBLOCK_FAILURE;
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
      if (this.userExists()) {
        const ref = firebase.storage().ref('avatar').child(this.uid);
        const task = ref.put(blob);
        return new Promise((resolve, reject) => {
          task.on('state_changed', () => { }, reject, 
            () => resolve(task.snapshot.ref.getDownloadURL()));
        });
      } else {
        return new Promise.reject(new Error('User Not Signed In'));
      }
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