export const environment = {
  firebaseConfig: {
    apiKey: process.env['FIREBASE_API_KEY'],
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
    databaseURL: process.env['FIREBASE_DATABASE_URL'],
    projectId: process.env['FIREBASE_PROJECT_ID'],
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: process.env['FIREBASE_MESSENGER_ID'],
    appId: process.env['FIREBASE_APP_ID'],
  },
};
