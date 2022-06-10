import { MessageDto } from "./chat.dto";
export declare class ChatService {
    constructor();
    getMessages(roomId: string, fromIndex: number, toIndex: number): MessageDto[];
}
export declare const chatService: ChatService;
