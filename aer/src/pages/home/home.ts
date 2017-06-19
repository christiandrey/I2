import { AerProvider } from '../../providers/aer/aer';
import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NavController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  animatedAssetsURL: string;
  currentData: any;
  currentTime: Date;
  dayOfWeek: number;
  days: Array<string>;
  errors: Array<string>;
  forecastData: Array<any>;
  getCurrentTime: any;
  latitude: number;
  longitude: number;
  nonAnimatedAssetsURL: string;
  pageIsLoading: boolean;
  temperatureUnit: string;
  timeOfDay: string;
  timeZoneDifference: number;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private aer: AerProvider, private screenOrientation: ScreenOrientation) {
    this.errors = new Array<string>();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).catch(error => {
      this.errors.push(error)
    })
    this.pageIsLoading = true;
    this.currentTime = new Date();
    this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.dayOfWeek = new Date().getDay();
    this.temperatureUnit = "celsius";
    this.timeZoneDifference = this.currentTime.getHours() - this.currentTime.getUTCHours();
    this.getCurrentTime = setInterval(() => {
      this.currentTime = new Date()
    }, 5000)
  }

  convertTemperatureUnits() {
    function toTwoDP(value: any) {
      return Math.round(value * 100) / 100
    }

    function toFahrenheit(celsius: number) {
      return celsius * 1.8 + 32
    }

    function toCelsius(fahrenheit: number) {
      return (fahrenheit - 32) / 1.8
    }

    switch(this.temperatureUnit) {
      case "celsius":
      this.currentData.main.temp = toTwoDP(toFahrenheit(parseFloat(this.currentData.main.temp)));
      for(let i = 0; i < this.forecastData.length; i++) {
          this.forecastData[i].main.temp = toFahrenheit(parseFloat(this.forecastData[i].main.temp));
      }
      this.temperatureUnit = "fahrenheit";
      break;
      case "fahrenheit":
      this.currentData.main.temp = toTwoDP(toCelsius(parseFloat(this.currentData.main.temp)));
      for(let i = 0; i < this.forecastData.length; i++) {
          this.forecastData[i].main.temp = toCelsius(parseFloat(this.forecastData[i].main.temp));
      }
      this.temperatureUnit = "celsius";
      break;
    }
  }

  ionViewDidLoad() {
    this.getLocation();
  }

  getLocation() {
    this.geolocation.getCurrentPosition({
      timeout: 30000,
      enableHighAccuracy: true,
      maximumAge: 3600
    }).then(response => {
      this.latitude = response.coords.latitude;
      this.longitude = response.coords.longitude;      
      this.getCurrentData(this.latitude, this.longitude);
    }).catch(error => {
      this.errors.push(error);
      console.log(this.errors);
    })
  }

  getCurrentData(latitude: number, longitude: number) {
    this.aer.getCurrentData(this.latitude, this.longitude).subscribe(response => {
      this.timeOfDay = this.currentTime.getHours() >= new Date(response.sys.sunrise * 1000).getHours() && this.currentTime.getHours() < new Date(response.sys.sunset  * 1000).getHours() ? "day" : "night";
      this.animatedAssetsURL = "assets/Icons/Animated/" + this.timeOfDay + "/";
      this.nonAnimatedAssetsURL = "assets/Icons/Non-Animated/" + this.timeOfDay + "/";
      this.currentData = response;
      this.getForecastData(this.latitude, this.longitude);
    })
  }

  getForecastData(latitude: number, longitude: number) {
    this.aer.getForecastData(this.latitude, this.longitude).subscribe(response => {
      this.forecastData = response.list.filter(x => 
        x.dt == (Date.UTC(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate() + 1, this.getAdjustedMidday()) / 1000) ||
        x.dt == (Date.UTC(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate() + 2, this.getAdjustedMidday()) / 1000) || 
        x.dt == (Date.UTC(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate() + 3, this.getAdjustedMidday()) / 1000)
      );
      this.pageIsLoading = false;
    })
  }

  getAdjustedMidday() {
    let GMTMiddayAtLocalTime = Math.abs(12 + this.timeZoneDifference);
    let remainder = GMTMiddayAtLocalTime % 3;
    let adjustedMidday;
    switch(remainder) {
      case 0:
      adjustedMidday = GMTMiddayAtLocalTime;
      break;
      case 1:
      adjustedMidday = GMTMiddayAtLocalTime - 1;
      break;
      case 2:
      adjustedMidday = GMTMiddayAtLocalTime + 1;
      break;
    }
    return adjustedMidday;
  }

  handleChangeUnits() {
    this.convertTemperatureUnits();
  }

  handleRefresh() {
    this.pageIsLoading = true;
    this.temperatureUnit = "celsius";
    this.getCurrentData(this.latitude, this.longitude);
  }

}