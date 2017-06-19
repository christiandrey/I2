import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()

export class DustyService {
    http: any;
    baseUrl: string;
    APPID: string;

    constructor(http: Http) {
        this.http = http;
        this.baseUrl = "http://api.openweathermap.org/data/2.5/weather";
        this.APPID = "156aeb9a86636e7851669e7acb60e12a"
    }

    getWeatherData(latitude: number, longitude: number) {
        return this.http.get(this.baseUrl + "?lat=" + latitude +"&lon=" + longitude + "&units=metric&APPID=" + this.APPID)
            .map(response => response.json())
    }
}