import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { HistoryService } from '../../service/history.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { DevicePositionPage } from '../device-position/device-position'
import { LoginService } from '../../service/login.service';

/**
 * Generated class for the InstallHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-install-history',
  templateUrl: 'install-history.html',
})
export class InstallHistoryPage {
  userId: string;
  historyList = [];
  queryStr = '';
  page = 1;
  pageSize = 10;
  hasmore = true;
  platform: string;
  constructor(public navCtrl: NavController, 
    private historyService: HistoryService,
    private loginService: LoginService,
    private storage: Storage,
    public plt: Platform, 
    public jwtHelper: JwtHelperService,
    // public navParams: NavParams,
    ) {
    if (this.plt.is('ios')) {
      // This will only print when on iOS
      this.platform = 'ios';
      console.log('I am an iOS device!');
    } else if (this.plt.is('android')) {
      this.platform = 'md';
      console.log('I am an iOS android!');
    } else {
      this.platform = 'ios';
      console.log('I am an iOS device!');
    }

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad InstallHistoryPage');
    this.getToken();

  }

  ionViewDidEnter() {
    this.queryStr = '';
    this.page = 1;
    this.getHistory(this.userId);

  }


  searchHistory(str) {
    this.page = 1;
    this.historyList = [];
    this.queryStr = str;
    this.getHistory(this.userId);

  }

  // 解析token
  getToken() {
    const that = this;
    this.storage.get('access_token').then((token) => {
      const token1 = that.jwtHelper.decodeToken(token);
      that.userId = token1.userid;

    });
  }
  getAllHistory(userId) {
    const that = this;
    this.historyService.getAllHistory(userId)
      .subscribe({
        next: function (val) {
          that.historyList = val;
          console.log(val)
        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('Access Denied') > 0) {
            that.loginService.logout();// 退出登录
          }
          else {
            let error2 = error && error['error'];
            console.log(error2);
            // that.error = error2.errors && error2.errors[0].defaultMessage;
          }
        }
      })
  }
  getHistory(userId) {
    const that = this;
    this.historyService.getHistory(userId, this.page, this.pageSize, this.queryStr)
      .subscribe({
        next: function (val) {

          if (val.items.length > 0) {
            that.historyList = that.historyList.concat(val.items);
            that.page += 1;
          } else {
            that.hasmore == false;
            console.log("已加载所有数据！")
          }
        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('Access Denied') > 0) {
            that.loginService.logout();// 退出登录
          }
          else {
            let error2 = error && error['error'];
            console.log(error2);
            // that.error = error2.errors && error2.errors[0].defaultMessage;
          }
        }
      })
  }



  doInfinite(infiniteScroll) {
    //判断是否有更多数据
    if (this.hasmore == false) { infiniteScroll.complete(); return; }
    // this.getHistory(this.userId);
    // setTimeout(() => {
    //   infiniteScroll.complete();
    // }, 1);

    const that = this;
    this.historyService.getHistory(this.userId, this.page, this.pageSize, this.queryStr)
      .subscribe({
        next: function (val) {

          if (val.items.length > 0) {
            that.historyList = that.historyList.concat(val.items);
            that.page += 1;
          } else {
            that.hasmore == false;
            console.log("已加载所有数据！")
          }
          infiniteScroll.complete();
        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('Access Denied') > 0) {
            that.loginService.logout();// 退出登录
          }
          else {
            let error2 = error && error['error'];
            console.log(error2);
            // that.error = error2.errors && error2.errors[0].defaultMessage;
          }
        }
      })


  }

  goToIndexPage() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    // this.navCtrl.push(IndexPage);
    this.navCtrl.pop();

  }

  // 绑定安装点
  goToDevicePositionPage(deviceName, modelId, modelIdName) {

    this.navCtrl.push(DevicePositionPage, { deviceName: deviceName, modelId: modelId, modelIdName: modelIdName});
  }



}
