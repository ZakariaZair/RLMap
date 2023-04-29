import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { spawn } from 'child_process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Nest.js API is running!';
  }

  @Post('run')
  async runScript(@Body('command') command: string): Promise<any> {
    if (!command) {
      throw new Error('No command provided');
    }
    const args = [
      '-n',
      '-p',
      './assets/replays/00DA647E452FB993FF10598678FDBB67.replay',
    ];

    return new Promise((resolve, reject) => {
      const childProcess = spawn(command, args);

      let stdout = '';
      let stderr = '';

      childProcess.stdout.on('data', (data) => {
        stdout += data;
      });

      childProcess.stderr.on('data', (data) => {
        stderr += data;
      });

      childProcess.on('error', (error) => {
        console.error(`Error executing command: ${error}`);
        reject(`Error executing command: ${error}`);
      });

      childProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Command exited with code ${code}`);
          console.error(`stderr: ${stderr}`);
          reject(`Error executing command: ${stderr}`);
          return;
        }
        resolve(stdout);
      });
    });
  }
}
