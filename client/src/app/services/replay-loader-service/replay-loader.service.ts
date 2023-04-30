import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReplayLoaderService {
  constructor(private http: HttpClient) {}

  loadReplay() {}

  runScript() {
    const commandPath = './command/rrrocket';
    const command = commandPath;
    this.http.post('http://ec2-35-183-116-195.ca-central-1.compute.amazonaws.com:3000/run', { command }).subscribe(
      (response) => {
        console.log('Script executed:', response);
      },
      (error) => {
        console.error('Error executing script:', error);
      }
    );
  }
}
