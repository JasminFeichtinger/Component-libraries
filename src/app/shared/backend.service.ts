import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Sensor } from '../Sensor';
import { Sensorendata } from '../Sensorendata';
import { SensorendataResponse } from '../SensorendataResponse';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  page: number = 1;
  sensorsPerPage: number = 10;
  entryCount: number = 0;

  constructor(private storeService: StoreService, private http: HttpClient) { }

  sensoren: Sensor[] = [];

  public async getSensoren() {
    this.sensoren = await firstValueFrom(this.http.get<Sensor[]>('http://localhost:5000/sensors'));
    this.storeService.sensoren = this.sensoren;
  }

  public async getSensorenDaten() {
    const sensorenDataResponse = await firstValueFrom(this.http.get<any>(
      `http://localhost:5000/sensorsData?_page=${this.page}&_limit=${this.sensorsPerPage}`, { observe: 'response' }));
    this.entryCount = Number(sensorenDataResponse.headers.get('X-Total-Count'));
    const sensorenData: Sensorendata[] = sensorenDataResponse.body.map((data: { sensorId: number; }) => {
      const sensor: Sensor = this.sensoren.filter(sensor => sensor.id == data.sensorId)[0];
      return { ...data, sensor }
    });
    this.storeService.sensorenDaten = sensorenData;
    console.log('Getting sensor data with page: ' + this.page + ' sensorsPerPage: ' + this.sensorsPerPage + ' total: ' + this.entryCount);
  }


  public async addSensorsData(sensorenData: Sensorendata[]) {
    await firstValueFrom(this.http.post('http://localhost:5000/sensorsData', sensorenData));
    await this.getSensorenDaten();
  }

  public async deleteSensorsDaten(sensorId: number) {
    await firstValueFrom(this.http.delete(`http://localhost:5000/sensorsData/${sensorId}`));
    await this.getSensorenDaten();
  }
}
