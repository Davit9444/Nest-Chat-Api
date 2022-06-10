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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const chat_websocket_gateway_1 = require("./chat.websocket.gateway");
const chat_service_1 = require("./chat.service");
const chat_dto_1 = require("./chat.dto");
let RoomsController = class RoomsController {
    createRoom(roomDto) {
        console.log("Creating chat room...", roomDto);
        try {
            return chat_websocket_gateway_1.ChatWebSocketGateway.createRoom(roomDto);
        }
        catch (error) {
            console.error('Failed to initiate room', error);
            throw error;
        }
    }
    getRoomMessages(roomId, fromIndex, toIndex) {
        console.log("Retrieving room messages with roomId: %s and indexes from: %s to %s", roomId, fromIndex, toIndex);
        if (fromIndex <= 0 || toIndex <= 0) {
            this.throwBadRequestException('req-params.validation', "Invalid parameters, 'fromIndex' and 'toIndex' must be positive");
        }
        if (fromIndex > toIndex) {
            this.throwBadRequestException('req-params.validation', "Invalid parameters, 'toIndex' must no not be less than 'fromIndex'");
        }
        try {
            return chat_service_1.chatService.getMessages(roomId, fromIndex, toIndex);
        }
        catch (error) {
            console.error('Failed to get room messages', error);
            throw new common_1.ForbiddenException({ code: 'access-forbidden', message: 'The access is forbidden' });
        }
    }
    closeRoom(roomId) {
        console.log("Deleting room with roomId:", roomId);
        try {
            return chat_websocket_gateway_1.ChatWebSocketGateway.close(roomId);
        }
        catch (error) {
            console.error('Failed to close room', error);
            throw error;
        }
    }
    throwBadRequestException(code, message) {
        throw new common_1.BadRequestException({ code, message });
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.RoomDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Get)('/:roomId/messages'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)('fromIndex', new common_1.ParseIntPipe(), new common_1.DefaultValuePipe(0))),
    __param(2, (0, common_1.Query)('toIndex', new common_1.ParseIntPipe(), new common_1.DefaultValuePipe(0))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Array)
], RoomsController.prototype, "getRoomMessages", null);
__decorate([
    (0, common_1.Delete)('/:roomId'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "closeRoom", null);
RoomsController = __decorate([
    (0, common_1.Controller)('/api/v1/rooms')
], RoomsController);
exports.RoomsController = RoomsController;
//# sourceMappingURL=rooms.controller.js.map