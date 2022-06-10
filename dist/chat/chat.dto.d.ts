export interface MessageEventDto extends MessageDto {
    socketId?: string;
    roomId: string;
    avatar: string;
}
export interface MessageDto {
    order: number;
    username: string;
    content: string;
    createdAt: Date;
}
export interface ChatDto extends MessageDto {
    socketId?: string;
    roomId: string;
    avatar: string;
}
export interface Participant {
    roomId: string;
    username: string;
    avatar: string;
    connected: boolean;
}
export declare class RoomData {
    createBy: string;
    createDate: Date;
    messages: Array<MessageDto>;
    participants: Map<string, Participant>;
    constructor(createBy: string);
}
export declare class RoomDto {
    roomId: string;
    createUsername: string;
}
export declare function toMessageDto(value: MessageEventDto): {
    order: number;
    username: string;
    content: string;
    createdAt: Date;
};
