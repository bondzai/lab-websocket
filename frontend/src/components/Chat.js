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

    const renderMessages = () => {
        return messages.map((m, index) => (
            <li key={index}>
                <div className="message-info">
                    <span className="message-time">{new Date().toLocaleString()}</span>
                </div>
                <pre>{JSON.stringify(m, null, 2)}</pre>
            </li>
        ));
    };

    return (
        <div className='Chat'>
            <div className='top-bar'>
                <h4> WebSocket Client </h4>
            </div>
            <div className='status-panel'>
                <div style={connectedStyle}></div>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className='messages'>
                <ul>
                    {renderMessages()}
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
