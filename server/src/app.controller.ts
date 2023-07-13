import { Controller, Post, Get } from '@nestjs/common';
import { spawn } from 'child_process';
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
      let output = '';
      const childProcess = spawn(command, args);
      childProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      childProcess.on('error', (error) => {
        reject(error);
      });
      childProcess.on('close', (code) => {
        if (code !== 0) {
          reject(`Process exited with code ${code}`);
        } else {
          resolve(output);
        }
      });
    });
  }
}
