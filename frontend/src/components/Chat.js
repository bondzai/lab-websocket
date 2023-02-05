import React, { useState, useEffect } from 'react';
import './Chat.css'

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:8000/ws/1/');
        setSocket(newSocket);
    }, []);
  
    useEffect(() => {
        if (socket) {
            socket.onopen = () => {
                console.log('WebSocket connection opened');
                setIsConnected(true);
            };
          
            socket.onmessage = (event) => {
                console.log('Received message:', event.data);
                setMessages([...messages, JSON.parse(event.data)]);
            };
          
            socket.onclose = () => {
                console.log('WebSocket connection closed');
                setIsConnected(false);
            };
        }
    }, [socket, messages]);
  
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSendClick = () => {
        socket.send(JSON.stringify({ message: message }));
        setMessage('');
    }

    return (
        <div>
            <h1> WebSocket API </h1>
            <div>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div>
                <ul>
                    {messages.map((m, index) => (
                        <li key={index}> {m.message}</li>
                    ))}
                </ul>
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                />
                <button onClick={handleSendClick}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
