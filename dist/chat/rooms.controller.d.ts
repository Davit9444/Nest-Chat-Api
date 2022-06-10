import { RoomDto } from "./chat.dto";
export interface MessageDto {
    username: string;
    content: string;
    createdAt: Date;
}
export declare class RoomsController {
    createRoom(roomDto: RoomDto): void;
    getRoomMessages(roomId: string, fromIndex: number, toIndex: number): MessageDto[];
    closeRoom(roomId: string): void;
    private throwBadRequestException;
}
