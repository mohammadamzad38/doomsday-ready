import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      success: true,
      message: 'Doomsday Ready API is running',
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
