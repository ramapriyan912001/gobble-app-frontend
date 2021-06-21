import firebase from 'firebase';
import { Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) { //avoid re-initializing -> HIDE LATER
      firebase.initializeApp({
        apiKey: "AIzaSyBEJucuLUGt2iBYJJmAjYGh0NLmk9aKSL8",
        authDomain: "gobble-b3dfa.firebaseapp.com",
        databaseURL: "https://gobble-b3dfa-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "gobble-b3dfa",
        storageBucket: "gobble-b3dfa.appspot.com",
        messagingSenderId: "816051198473"
      });
     }
  }

  //login
  login = async(user, success_callback, failed_callback) => {
      await firebase.auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback)
      .catch(failed_callback);
    }

  //Sign Out
  signOut = (success, failure) => {
    firebase
    .auth()
    .signOut()
    .then(success)
    .catch(failure)
  };

  //Register
  createUser = (user, success, failure) => {
    firebase
    .auth()
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(success)
    .catch(failure);//if create user with email and pw fails    
  }

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
                                            : failure({code: 'auth/user-token-expired', message: 'No data provided. Retry Registration'});

  getUserCollection = (id, success, failure) => id != null
                                                ? this
                                                  .userRef(id)
                                                  .once('value')
                                                  .then(success)
                                                  .catch(failure)
                                                : failure({code: 'auth/invalid-id', message: 'Invalid UID provided'})

  currentUser = () => firebase.auth().currentUser;

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
  messageRefRetrieve = callback => {
    // console.log('Retrieving Old Messages: ');
    this.messageRef('')
      // .limitToLast(40)
      .on('value', snapshot => callback(this.parseStoredMessage(snapshot)));
  }

  messageRefOn = callback => {
    // console.log('New Message: ');
    this.messageRef('')
      .limitToLast(40)
      .on('child_added', snapshot => callback(this.parseMessage(snapshot)));
  }

  messageRefOff() {
    this.messageRef('').off();
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
    return parsedMessageArray;
  };

  //Password Reset
  resetPassword = (email, success, failure) =>
    firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(success)
    .catch(failure);

  // To send a message, we call the send method from GiftedChat component in onSend property as such: onSend={firebaseSvc.send}
  // The send method in Firebase.js is:
  send = messages => {
    messages.map((message) => {
      const {text, user, createdAt} = message;
      const timestamp = createdAt.toDateString();
      const newMessage = {text, user, timestamp};
      this.messageRef('').push(newMessage)});
    // for (let i = 0; i < messages.length; i++) {
    //   const { text, user, createdAt } = messages[i];
    //   console.log(createdAt);
    //   this.messageRef('').push({text, user, createdAt});
    // }
  };

  get uid() {
    return this.currentUser().uid;
  }

  messageRef(params) {
    return firebase.database().ref(`Messages/${params}`);
  }

  userRef(params) {
    return firebase.database().ref(`Users/${params}`);
  }

  matchesRef(params) {
    return firebase.database().ref(`Matches/${params}`);
  }

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
        console.warn("Avatar Update Error: " + error.message);
        Alert.alert("Error updating avatar. " + error.message);
      });
    } else {
      console.warn("can't update avatar, user is not logged in.");
      Alert.alert("Unable to update avatar. You must re-authenticate first.");
      props.navigation.navigate('Reauthentication');
    }
  }

}
// To apply the default browser preference instead of explicitly setting it.
// firebase.auth().useDeviceLanguage();
// firebase.auth().languageCode = 'de';

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;

// var firebaseConfig = {
//     apiKey: "AIzaSyBEJucuLUGt2iBYJJmAjYGh0NLmk9aKSL8",
//     authDomain: "gobble-b3dfa.firebaseapp.com",
//     databaseURL: "https://gobble-b3dfa-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "gobble-b3dfa",
//     storageBucket: "gobble-b3dfa.appspot.com",
//     messagingSenderId: "816051198473",
//     appId: "1:816051198473:web:7de57f3eb1e72eaec8f6d8",
//     measurementId: "G-D9J9SX4T89"