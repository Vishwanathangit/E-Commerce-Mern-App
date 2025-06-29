import {  signInWithEmailAndPassword   } from 'firebase/auth'
import { auth } from '../config/firebase'
import { firebaseStorage } from '../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { generateRandomText } from '../utility/commonFunc'

export const firebaseLogin = (user) => {
    return signInWithEmailAndPassword(auth, user.email, user.password)
}

export const getUserAuthToken = async () => {
    return auth?.currentUser ? auth.currentUser.getIdToken() : null
}

export const signoutFirebaseUser = async () => {
    try {
        await auth.signOut();
        // Handle any additional logic after successful logout
    } catch (error) {
        // Handle any errors that occur during logout
        console.error('Error logging out:', error);
    }
}

export const uploadFileOnFirebase = (image) => {
    const uploadTask = ref(firebaseStorage, `images/${generateRandomText() + '-' + image.name}`)
    return uploadBytes(uploadTask, image)
}

export const getImageUrl = async (imagePath) => {
    try {
        return await new Promise((resolve) => {
            getDownloadURL(ref(firebaseStorage, imagePath)).then((downloadUrl) => {
                resolve(downloadUrl)
            });
          })
    } catch (error) {
      console.error('Error getting download URL:', error);
      return null;
    }
  };
