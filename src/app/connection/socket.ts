import io from 'socket.io-client';

function openSocket(hostname: string | undefined, port: string | undefined){
    const socket = io(`http://${hostname}:${port}`, {
        autoConnect: false
    });
    return socket;
}

export default openSocket;
