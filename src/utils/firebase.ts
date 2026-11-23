import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBDoNaCHDNrI4xqo3emoceh389uH2ye1Nk',
    authDomain: 'fit-cabinet.firebaseapp.com',
    projectId: 'fit-cabinet',
    storageBucket: 'fit-cabinet.firebasestorage.app',
    messagingSenderId: '547777070419',
    appId: '1:547777070419:web:aff8173f519e6a71bf4da6',
    measurementId: 'G-Q05R8NXHWC',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();
export const googleProvider = new GoogleAuthProvider();
