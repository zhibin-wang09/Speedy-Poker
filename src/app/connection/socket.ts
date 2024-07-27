import {io,Socket} from 'socket.io-client';
import { ClientToServer, ServerToClient } from '../../../shared/types/events';
const socket : Socket<ServerToClient, ClientToServer> = io(`http://${"localhost"}:${8080}`);

export default socket;
