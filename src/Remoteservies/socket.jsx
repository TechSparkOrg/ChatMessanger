import React, { createContext, useState, useEffect } from 'react';

export const SocketContext = createContext();

export  const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(false)
    

    
    const initializeSocket = (socketUrl) => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            const socketi = new WebSocket(socketUrl);
            socketi.onopen = () => {
                resolve(socketi)
                setLoading(false)
            };
            socketi.onerror = (error) => {
                reject('err', error)
                setLoading(false)
            };
            socketi.onclose =  () => {
                reject('close socket connection')
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
const socketUrl = `${wsScheme}://127.0.0.1:5173/ws/chat/${user.id}/?token=${token}`;
    
        if (user && user.id && !socket) {
          initializeSocket(socketUrl)
            .then(socketi => {
              setSocket(socketi);
            })
            .catch(() => {
              setTimeout(async () => {
                try {
                  const socketi = await initializeSocket(socketUrl);
                  setSocket(socketi);
                } catch (err) {
                  console.error('Socket initialization failed:', err);
                }
              }, 1000);
            });
        }
        return () => {
          if (socket) {
            socket.close();
          }
        };
      }, [socket]);
      
    return (
        <SocketContext.Provider value={{ socket, setSocket, loading }}>
            {socket ? children : null}
        </SocketContext.Provider>
      );
}



