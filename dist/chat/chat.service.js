"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const chat_dto_1 = require("./chat.dto");
const chat_websocket_gateway_1 = require("./chat.websocket.gateway");
class ChatService {
    constructor() {
    }
    getMessages(roomId, fromIndex, toIndex) {
        const room = chat_websocket_gateway_1.ChatWebSocketGateway.get(roomId);
        if (!room) {
            throw new common_1.NotFoundException({ code: 'room.not-found', message: 'Room Not Found' });
        }
        return room.messages.filter((value, index) => index >= fromIndex - 1 && index < toIndex).map(chat_dto_1.toMessageDto);
    }
}
exports.ChatService = ChatService;
exports.chatService = new ChatService();
//# sourceMappingURL=chat.service.js.map