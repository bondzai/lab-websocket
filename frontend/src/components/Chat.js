import React, { useState, useEffect } from 'react';
import './Chat.css';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [endpoint, setEndpoint] = useState('wss://aot-dev.sitearound.com/ws/airport/BKK/'); // default endpoint

    useEffect(() => {
        if (socket) {
            socket.onopen = () => {
                console.log('WebSocket connection opened');
                setIsConnected(true);
            };

            socket.onmessage = (event) => {
                console.log('Received message:', event.data);
                setMessages(prevMessages => [JSON.parse(event.data), ...prevMessages]);
            };
            

            socket.onclose = () => {
                console.log('WebSocket connection closed');
                setIsConnected(false);
            };
        }
    }, [socket, messages]);

    const handleConnectClick = () => {
        const newSocket = new WebSocket(endpoint);
        setSocket(newSocket);
    };

    const handleDisconnectClick = () => {
        socket.close();
        setSocket(null);
        setIsConnected(false);
    };

    const handleClearClick = () => {
        setMessages([]);
    };

    const connectedStyle = {
        backgroundColor: isConnected ? 'green' : 'red',
        display: 'inline-block',
        borderRadius: '50%',
        width: '12px',
        height: '12px',
        marginRight: '5px',
        animation: isConnected ? 'blinking 1s infinite' : 'none'
    };

    return (
        <div className='Chat'>
            <h1> WebSocket Client </h1>
            <div className='status-panel'>
                <div style={connectedStyle}></div>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className='messages'>
                <ul>
                    {messages.map((m, index) => (
                        <li key={index}>
                            <pre>{JSON.stringify(m, null, 2)}</pre>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='control-panel'>
                <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                />
                <button onClick={handleConnectClick}>Connect</button>
                <button onClick={handleDisconnectClick}>Disconnect</button>
                <button onClick={handleClearClick}>Clear Data</button>
            </div>
        </div>
    );
};

export default Chat;
