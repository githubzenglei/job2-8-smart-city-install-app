import { Component } from '@angular/core';
import { ViewController, AlertController, App, NavController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { InstallHistoryPage } from '../install-history/install-history';

/**
 * Generated class for the IndexPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
// @Component({
//   template: `
//     <ion-list>
//       <button ion-item (click)="close()">历史记录</button>
//       <button ion-item (click)="close()">退出</button>
//     </ion-list>
//   `
// })

@Component({
  selector: 'page-index-popover',
  templateUrl: 'index-popover.html',
})
export class IndexPopoverPage {

  constructor(public viewCtrl: ViewController, 
    public alertCtrl: AlertController, 
    private storage: Storage, 
    private appCtrl: App,
    public navCtrl: NavController,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPopoverPage');
  }
  close() {
    this.viewCtrl.dismiss();
  }

  logout() {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '你确定要退出应用吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            window.localStorage.removeItem('access_token');
            this.storage.remove('access_token');
            this.appCtrl.getRootNav().setRoot(LoginPage); //调用this.app.getRootNav() 从根页面跳转就可以了)
            this.close();
          }
        }
      ]
    });
    confirm.present();
  }

  goToInstallHistoryPage() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.close();
    this.navCtrl.push(InstallHistoryPage);
  }

}
