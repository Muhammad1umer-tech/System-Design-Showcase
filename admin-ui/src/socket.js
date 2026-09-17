import { redis_socket_baseURL } from "../constants";

let socketInstance = null;

export const initWebSocket = (logged_in) => {

    if (!socketInstance && logged_in===true) {


    socketInstance = new WebSocket(`ws://${redis_socket_baseURL}/ws/test/?room_name=${localStorage.getItem('access')}`);


    socketInstance.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });

    socketInstance.addEventListener('message', () => {
      console.log('come from backend');
    });

    socketInstance.addEventListener('error', (error) => {
      console.error('WebSocket connection error:', error);
    });


  }

  return socketInstance;
};


export const closeWebSocket = () => {
    console.log("socket connection closed")
    if (socketInstance) {
      socketInstance.close();
      socketInstance = null; // Reset socketInstance
    }
  };