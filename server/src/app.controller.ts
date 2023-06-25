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
  async runScript(@Body('file') file: string): Promise<any> {
    if (!file) {
      throw new Error('No file provided');
    }

    const args = [
      '-i',
      '../assets/replays/00DA647E452FB993FF10598678FDBB67.replay',
      '-o',
      '../assets/replays/output.json',
    ];
    const command = 'rattletrap';

    return new Promise((resolve, reject) => {
      const childProcess = spawn(command, args);
      let stderr = '';

      childProcess.stderr.on('data', (data) => {
        stderr += data;
      });

      childProcess.on('error', (error) => {
        reject(`Error executing command: ${error}`);
      });

      childProcess.on('close', async (code) => {
        if (code !== 0) {
          reject(`Error executing command: ${stderr}`);
          return;
        }
        try {
          const data = await fs.readFile('./output.json', 'utf8');
          resolve(data);
        } catch (error) {
          reject(`Error reading output file: ${error}`);
        }
      });
    });
  }
}
