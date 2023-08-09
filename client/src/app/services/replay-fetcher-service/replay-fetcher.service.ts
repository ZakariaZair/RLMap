import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplayData } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ReplayFetcherService {
  replayData: ReplayData;
  replayFrames: any;

  constructor(private http: HttpClient) {
    this.replayData = {} as ReplayData;
  }

  async runScript() {
    try {
      const response = await this.http
        .post('https://api.rlmap.ca:3000/run', {})
        .toPromise();
      // this.replayData = response as ReplayData;
    } catch (error) {
      console.error('Error executing script:', error);
    }
  }

  loadReplay() {
    console.log(this.replayData.Part1Length);
  }

  readJsonFromAssets(filename: string = 'replayDataTest.json'): Promise<any> {
    return this.http.get(`/assets/${filename}`).toPromise();
  }
}
