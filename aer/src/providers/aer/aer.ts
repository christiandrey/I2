import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AerProvider {
  baseUrl: string;
  APPID: string;

  constructor(public http: Http) {
    this.http = http;
    this.baseUrl = "http://api.openweathermap.org/data/2.5/";
    this.APPID = "156aeb9a86636e7851669e7acb60e12a"
  }

  getCurrentData(latitude: number, longitude: number) {
    return this.http
      .get(this.baseUrl + "weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + this.APPID + "&units=metric")
      .map(response => response.json())
  }

  getForecastData(latitude: number, longitude: number) {
    return this.http
      .get(this.baseUrl + "forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + this.APPID + "&units=metric")
      .map(response => response.json())
  }

}
