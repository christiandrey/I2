import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { DustyService } from '../../app/services/dusty.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  latitude: number;
  longitude: number;
  location: string;
  temp: number;
  pressure: number;
  humidity: number;
  description: string;
  wind: number;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private dustyService: DustyService) {

  }

  ionViewDidLoad() {
    this.getLocation();
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((response) => {
      this.latitude = response.coords.latitude;
      this.longitude = response.coords.longitude;
      this.getWeatherData(this.latitude, this.longitude);
    })
  }

  getWeatherData(latitude: number, longitude: number) {
    this.dustyService.getWeatherData(latitude, longitude).subscribe((response) => {
      this.location = response.name;
      this.temp = response.main.temp;
      this.pressure = response.main.pressure;
      this.humidity = response.main.humidity;
      this.description = response.weather[0].description;
      this.wind = response.wind.deg;
    })
  }

}
