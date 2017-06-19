import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RedditService } from '../../app/services/reddit.service';
import { DetailsPage } from '../details/details';

/**
 * Generated class for the RedditsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'reddits',
  templateUrl: 'reddits.html',
})
export class RedditsPage {
  items: any;
  category: any;
  limit: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private redditService: RedditService) {
    this.getDefaults()
  }

  ionViewDidLoad() {
    this.getPosts(this.category, this.limit)
  }

  getDefaults() {
    this.category = "sports";
    this.limit = 10;
  }

  getPosts(category, limit) {
    this.redditService.getPosts(category, limit).subscribe(response => {
      this.items = response.data.children;
    })
  }

  viewItem(item) {
    this.navCtrl.push(DetailsPage, {
      item: item
    })
  }
  
  changeCategory() {
    this.getPosts(this.category, this.limit)
  }
}
