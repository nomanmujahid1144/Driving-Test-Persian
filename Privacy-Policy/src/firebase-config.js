
import  {initializeApp} from 'firebase/app';
import  {getAuth}  from "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyDksgKpiI2wplaJWUjj3mxQTODx-ryKKno",
    authDomain: "cannabis-website-bc9c4.firebaseapp.com",
    projectId: "cannabis-website-bc9c4",
    storageBucket: "cannabis-website-bc9c4.appspot.com",
    messagingSenderId: "123674224795",
    appId: "1:123674224795:web:552705f3962b81d5a6fe3e",
    measurementId: "G-DTMVKEJ9X3"
  }

const app = initializeApp(firebaseConfig)

export const authentication = getAuth(app);