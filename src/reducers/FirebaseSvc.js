import firebase from 'firebase';
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

  //Register
  createUser = (user, avatar, success, failure) => {
    firebase
    .auth()
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(success)
    .catch(failure)//if create user with email and pw fails
  }

  currentUser = () => firebase.auth().currentUser;

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('User has Logged In');
      } else {
        console.log('User has Logged Out');
      }
    });

  //Retrieve Messages
  refRetrieve = callback => {
    this.ref
      .limitToLast(40)
      .on('value', snapshot => callback(this.parse(snapshot)));
  }

  refOn = callback => {
    this.ref
      .limitToLast(40)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  refOff() {
    this.ref.off();
  }

  // The parse method take the snapshot data and construct a message:
  parse = snapshot => {
    console.log(snapshot);
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {_id, timestamp, text, user};
    return message;
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
    for (let i = 0; i < messages.length; i++) {
      const { text, user, createdAt } = messages[i];
      this.ref.push({text, user, createdAt});
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('Messages/');
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  //Upload Image to Firebase Storage
  uploadImage = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log(uuid());
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
    let userf = firebase.auth().currentUser;
    if (userf != null) {
      userf.updateProfile({ avatar: url})
      .then(() => console.log("Updated avatar successfully. url:" + url))
      .catch((error) => {
        console.warn("Error update avatar.");
        alert("Error update avatar. Error:" + error.message);
      });
    } else {
      console.log("can't update avatar, user is not login.");
      alert("Unable to update avatar. You must login first.");
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