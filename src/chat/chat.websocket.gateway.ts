import {OnGatewayConnection,
        OnGatewayDisconnect,
        SubscribeMessage,
        WebSocketGateway,
        WebSocketServer} from '@nestjs/websockets';
import { Socket } from "socket.io";
import { ConflictException,ForbiddenException, NotFoundException } from "@nestjs/common";
import { Participant,ChatDto, toMessageDto, RoomData, RoomDto } from "./chat.dto";


@WebSocketGateway()
export class ChatWebSocketGateway implements OnGatewayConnection , OnGatewayDisconnect {
   
     @WebSocketServer() server;

    private static rooms: Map<string,RoomData> = new Map();
    private static participants: Map<string, string> = new Map();

    handleConnection(socket: Socket): void {
        const socketId = socket.id;
        console.log(`New Connectig... socket.id ${socketId}`);
        ChatWebSocketGateway.participants.set(socketId,'');
    }

    handleDisconnect(socket:Socket): void {
        const socketId = socket.id;
        console.log(`Disconnect... socket.id ${socketId} `);
        const roomId = ChatWebSocketGateway.participants.get(socketId);
        const room = ChatWebSocketGateway.rooms.get(roomId);

        if(room){
            room.participants.get(socketId).connected = false;
            this.server.emit(`participants/${roomId}`,
            Array.from(room.participants.values())
            );
        }
    }

    @SubscribeMessage('participants')
        async  onParticipate(socket: Socket,participants: Participant) {
            const socketId = socket.id;
            console.log(`Registering new Participants... `,socketId,participants);

            const roomId = participants.roomId;
            if(!ChatWebSocketGateway.rooms.has(roomId)){
                console.error(`Room with id: %s was not found , disconnecting the participant`,roomId);
                socket.disconnect();
                throw new ForbiddenException('The acces is forbidden');
            }
            const room = ChatWebSocketGateway.rooms.get(roomId);
            ChatWebSocketGateway.participants.set(socketId,roomId);
            participants.connected = true;
            room.participants.set(socketId,participants);
            this.server.emit(`Participants/${roomId}`,Array.from(room.participants.values()));



            
        }
    @SubscribeMessage('exchanges')
    async onMessage(socket: Socket, message: ChatDto){
        const socketId = socket.id;
        message.socketId = socketId;
        console.log('Received new message... socketId: %s, message',socketId,message);

        const roomId = message.roomId;
        const roomData = ChatWebSocketGateway.rooms.get(roomId);
        message.order = roomData.messages.length + 1 ;
        roomData.messages.push(message);
        ChatWebSocketGateway.rooms.set(roomId,roomData);
        this.server.emit(roomId,toMessageDto(message));


    }

    static get(roomId: string): RoomData {
        return this.rooms.get(roomId); 
    }

    static createRoom(roomDto: RoomDto) : void {
        const roomId = roomDto.roomId;

        if(this.rooms.has(roomId)){
            throw new  ConflictException({code: 'room.conflict', message: `Room with '${roomId}' already exists `});
        }

        this.rooms.set(roomId, new RoomData(roomDto.createUsername));

    } 

    static close(roomId: string) {
        if(!this.rooms.has(roomId)){

            throw new NotFoundException({code: 'room.not-found',message: `Room with '${roomId}' not found`});

        }
        this.rooms.delete(roomId);
    }
    
        

}

