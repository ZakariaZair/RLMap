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
    try {
      const response = await this.http
        .post('https://api.rlmap.ca:3000/run', {})
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
