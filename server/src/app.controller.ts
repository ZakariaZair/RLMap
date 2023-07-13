import { Controller, Post, Body, Get } from '@nestjs/common';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Nest.js API is running!';
  }

  @Post('run')
  async runScript(): Promise<any> {
    const args = [
      './command/rlParser/RocketLeagueReplayParser.Console.dll',
      './assets/replays/00DA647E452FB993FF10598678FDBB67.replay',
    ];
    const command = 'dotnet';

    return new Promise((resolve, reject) => {
      console.log('Running script...');
      const childProcess = spawn(command, args);

      childProcess.stderr.on('data', (data) => {
        resolve(data);
      });
    });
  }
}
