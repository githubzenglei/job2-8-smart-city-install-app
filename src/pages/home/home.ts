import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { IndexPopoverPage } from '../index-popover/index-popover';
import { GatewayPositionPage } from '../gateway-position/gateway-position';
import { SubDevicePage } from '../sub-device/sub-device';
import { InstallHistoryPage } from '../install-history/install-history';

/**
 * Generated class for the IndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  gaming: 'nes';
  gender: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
    this.gender = 'f';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(IndexPopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  goToGatewayPage() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(GatewayPositionPage);
  }

  goToSubDevicePage() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(SubDevicePage);
  }

  goToInstallHistoryPage() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(InstallHistoryPage);
  }

}
