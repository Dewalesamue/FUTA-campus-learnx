// Mock Firebase configuration
// In a real app, this would contain actual Firebase initialization

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Mock Firebase functions
export const initializeApp = (config: FirebaseConfig) => {
  console.log('Firebase initialized with config:', config);
  return { app: 'mock-app' };
};

export const getAuth = () => {
  return { auth: 'mock-auth' };
};

export const getFirestore = () => {
  return { db: 'mock-firestore' };
};

export const getStorage = () => {
  return { storage: 'mock-storage' };
};

// Mock authentication functions
export const signInWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: { uid: 'mock-uid', email } });
    }, 1000);
  });
};

export const createUserWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: { uid: 'mock-uid', email } });
    }, 1000);
  });
};

export const signOut = async (auth: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};