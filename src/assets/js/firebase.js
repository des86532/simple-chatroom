import Vue from 'vue';

const firebaseConfig = {
  databaseURL: "https://smartbee-demo.firebaseio.com/",
  storageBucket: "gs://smartbee-demo.appspot.com",
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const storage = firebase.storage();

Vue.prototype.$database = database;

Vue.prototype.$storage = storage;