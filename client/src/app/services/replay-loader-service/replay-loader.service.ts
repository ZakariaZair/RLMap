import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReplayLoaderService {
  private replayData: any;
  constructor(private http: HttpClient) {}

  loadReplay() {}

  async runScript() {
    const commandPath = './command/rrrocket';
    const command = commandPath;
    try {
      const response = await this.http
        .post(
          'https://ec2-35-183-116-195.ca-central-1.compute.amazonaws.com:3000/run',
          { command }
        )
        .toPromise();
      console.log('Script executed:', response);
      this.replayData = response;
    } catch (error) {
      console.error('Error executing script:', error);
    }
  }

  getReplayData() {
    return this.replayData;
  }
}
