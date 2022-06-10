import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from "socket.io";
import { Participant, ChatDto, RoomData, RoomDto } from "./chat.dto";
export declare class ChatWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: any;
    private static rooms;
    private static participants;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    onParticipate(socket: Socket, participants: Participant): Promise<void>;
    onMessage(socket: Socket, message: ChatDto): Promise<void>;
    static get(roomId: string): RoomData;
    static createRoom(roomDto: RoomDto): void;
    static close(roomId: string): void;
}
