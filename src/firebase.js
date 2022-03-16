import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAcihBud1Lofsbf2xosQcpmQly0zmjECRs",
  authDomain: "stock-f95f8.firebaseapp.com",
  projectId: "stock-f95f8",
  storageBucket: "stock-f95f8.appspot.com",
  messagingSenderId: "868305919042",
  appId: "1:868305919042:web:74ec986bf9d85d24d1a1db"
};

const fireDb = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

export default fireDb.database().ref();