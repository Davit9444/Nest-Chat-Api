"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ChatWebSocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const chat_dto_1 = require("./chat.dto");
let ChatWebSocketGateway = ChatWebSocketGateway_1 = class ChatWebSocketGateway {
    handleConnection(socket) {
        const socketId = socket.id;
        console.log(`New Connectig... socket.id ${socketId}`);
        ChatWebSocketGateway_1.participants.set(socketId, '');
    }
    handleDisconnect(socket) {
        const socketId = socket.id;
        console.log(`Disconnect... socket.id ${socketId} `);
        const roomId = ChatWebSocketGateway_1.participants.get(socketId);
        const room = ChatWebSocketGateway_1.rooms.get(roomId);
        if (room) {
            room.participants.get(socketId).connected = false;
            this.server.emit(`participants/${roomId}`, Array.from(room.participants.values()));
        }
    }
    async onParticipate(socket, participants) {
        const socketId = socket.id;
        console.log(`Registering new Participants... `, socketId, participants);
        const roomId = participants.roomId;
        if (!ChatWebSocketGateway_1.rooms.has(roomId)) {
            console.error(`Room with id: %s was not found , disconnecting the participant`, roomId);
            socket.disconnect();
            throw new common_1.ForbiddenException('The acces is forbidden');
        }
        const room = ChatWebSocketGateway_1.rooms.get(roomId);
        ChatWebSocketGateway_1.participants.set(socketId, roomId);
        participants.connected = true;
        room.participants.set(socketId, participants);
        this.server.emit(`Participants/${roomId}`, Array.from(room.participants.values()));
    }
    async onMessage(socket, message) {
        const socketId = socket.id;
        message.socketId = socketId;
        console.log('Received new message... socketId: %s, message', socketId, message);
        const roomId = message.roomId;
        const roomData = ChatWebSocketGateway_1.rooms.get(roomId);
        message.order = roomData.messages.length + 1;
        roomData.messages.push(message);
        ChatWebSocketGateway_1.rooms.set(roomId, roomData);
        this.server.emit(roomId, (0, chat_dto_1.toMessageDto)(message));
    }
    static get(roomId) {
        return this.rooms.get(roomId);
    }
    static createRoom(roomDto) {
        const roomId = roomDto.roomId;
        if (this.rooms.has(roomId)) {
            throw new common_1.ConflictException({ code: 'room.conflict', message: `Room with '${roomId}' already exists ` });
        }
        this.rooms.set(roomId, new chat_dto_1.RoomData(roomDto.createUsername));
    }
    static close(roomId) {
        if (!this.rooms.has(roomId)) {
            throw new common_1.NotFoundException({ code: 'room.not-found', message: `Room with '${roomId}' not found` });
        }
        this.rooms.delete(roomId);
    }
};
ChatWebSocketGateway.rooms = new Map();
ChatWebSocketGateway.participants = new Map();
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], ChatWebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('participants'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatWebSocketGateway.prototype, "onParticipate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('exchanges'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatWebSocketGateway.prototype, "onMessage", null);
ChatWebSocketGateway = ChatWebSocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)()
], ChatWebSocketGateway);
exports.ChatWebSocketGateway = ChatWebSocketGateway;
//# sourceMappingURL=chat.websocket.gateway.js.map