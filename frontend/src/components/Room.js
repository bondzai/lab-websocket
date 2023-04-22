import React, { useState, useEffect } from 'react';
import './Room.css';

const Room = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [endpoint, setEndpoint] = useState('wss://aot-dev.sitearound.com/ws/airport/BKK/');
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        if (socket) {
            socket.onopen = () => {
                console.log('WebSocket connection opened');
                setIsConnected(true);
                setIsConnecting(false);
            };

            socket.onmessage = (event) => {
                console.log('Received message:', event.data);
                setMessages(prevMessages => [JSON.parse(event.data), ...prevMessages]);
            };

            socket.onclose = () => {
                console.log('WebSocket connection closed');
                setIsConnected(false);
                setIsConnecting(false);
            };
        }
    }, [socket, messages]);

    const handleToggleClick = () => {
        if (!isConnected) {
            const isValidURL = (() => {
                try {
                    new URL(endpoint);
                    return true;
                } catch (error) {
                    console.error(error)
                    return false;
                }
            })();

            if (!isValidURL) {
                console.log('Invalid endpoint:', endpoint);
                return;
            }

            setIsConnecting(true);
            const newSocket = new WebSocket(endpoint);
            setSocket(newSocket);
        } else {
            socket.close();
            setSocket(null);
            setIsConnected(false);
            setMessages([])
        }
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
        <div className='Room'>
            <div className='status-panel'>
                <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    disabled={isConnected}
                />
                <div style={connectedStyle}></div>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className='messages'>
                <ul>
                    {renderMessages()}
                </ul>
            </div>
            <div className='control-panel'>
                <button onClick={handleToggleClick} disabled={isConnecting}>{isConnecting ? 'Connecting...' : (isConnected ? 'Disconnect' : 'Connect')}</button>
                <button onClick={handleClearClick}>Clear Data</button>
            </div>
        </div>
    );
};

export default Room;
