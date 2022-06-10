import { Module } from '@nestjs/common';
import {ChatModule} from './chat/chat.module';
import { ChatWebSocketGateway } from './chat/chat.websocket.gateway';
import { RoomsController } from './chat/rooms.controller';



@Module({
  imports: [ChatModule],
  controllers: [RoomsController],
  providers: [ChatWebSocketGateway],
})
export class AppModule {}
