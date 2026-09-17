import React from 'react';

const Test = () => {

const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/');

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const message = data['message'];
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

// Send message to server
function sendMessage(message) {
    chatSocket.send(JSON.stringify({
        'message': message
    }));
}

  return (
    <div>
        <button onClick={()=>sendMessage("Hello")}>Send Message</button>
    </div>
  );
}

export default Test;
