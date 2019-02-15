import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SubDevicePositionPage } from '../sub-device-position/sub-device-position';
import { SubDeviceService } from '../../service/sub-device.service'
import { LoginService } from '../../service/login.service';


/**
 * Generated class for the SubdevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subdevice',
  templateUrl: 'sub-device.html',
})
export class SubDevicePage {
  error:string; // 错误码
  device: any = {}; // 子设备HTML参数
  subDevice = { // 子设备API参数
    "deviceName": "",
    "modelId": null,
    "parentName": "",
  }
  deviceModels = []; // 设备型号
  currentModel: any = {}; // 当前设备型号
  deviceGWModels = []; // 网关型号
  currentGWModel: any = {} // 当前网关型号
  deviceType = 1; // 网关类型
  gwdevice:any = {}; // 网关参数
  binding = 0; // 按钮
  countDown = 5; // 计时

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private subDeviceService: SubDeviceService,
    public loginService: LoginService,

    ) {
    this.gwdevice.online = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubdevicePage');
    this.getModels();
    this.getModelsByType();
  }

  ionViewDidEnter() {
    this.binding = 0;
    this.countDown = 5; // 计时
    this.device.name = '';
    this.device.pname = '';
    this.gwdevice.online = '';
    this.gwdevice.description = '';
    this.device.pname =  this.navParams.get('scantextParent') || '';
    this.device.name  = this.navParams.get('scantextSub') || '';

  }

  // 获取设备型号
  getModelsByType() {
    const that = this;
    this.subDeviceService.getModelsByType(this.deviceType)
      .subscribe({
        next: function (val) {
          that.deviceGWModels = val;
          that.currentGWModel = that.deviceGWModels[0];
        },
        complete: function () {

        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('expired') > 0) {
            that.loginService.logout();// 退出登录
          } else if (error.message && error.message.indexOf('Http failure') > 0) {
            that.error = error.statusText;
          }
          else {
            let error2 = error && error['error'];
            that.error = error2.errors && error2.errors[0].defaultMessage;
          }
        }
      })
  }


  // input 改变时
  valueChange(e) {
    this.error = '';
  }
  // 扫描二维码
  qrScanners(type) {
    this.navCtrl.push('ScanPage', { devicetype: type});
  }


  // 获取设备型号
  getModels() {
    const that = this;
    this.subDeviceService.getModels()
      .subscribe({
        next: function (val) {
          that.deviceModels = val;
          that.currentModel = that.deviceModels[0];
          that.subDevice.modelId = that.currentModel.id;
        },
        complete: function () {

        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('expired') > 0) {
            that.loginService.logout();// 退出登录
          } else if (error.message && error.message.indexOf('Http failure') > 0) {
            that.error = error.statusText;
          }
          else {
            let error2 = error && error['error'];
            that.error = error2.errors && error2.errors[0].defaultMessage;
          }
        }
      })
  }

  // 获取网关设备信息
  getDeviceByName(name) {
    if (!name || name == null || name == '') {
      return
    }
    const that = this;
    name = name.trim();
    this.subDeviceService.getDeviceByName(name)
      .subscribe({
        next: function (val) {
          that.gwdevice = val;

        },
        complete: function () {

        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('expired') > 0) {
            that.loginService.logout();// 退出登录
          }
          else {
            let error2 = error && error['error'];
            that.error = error2.errors && error2.errors[0].defaultMessage;
          }
        }
      })
  }
  // 获取zi设备信息
  getSubDeviceByName(name) {
    if (!name || name == null || name == '') {
      return
    }
    const that = this;
    name = name.trim();
    this.subDeviceService.getDeviceByName(name)
      .subscribe({
        next: function (val) {
          if (val.online) {
            that.countDown = 0;
            that.device.online = val.online;
            // that.binding = 2;
          }

        },
        complete: function () {

        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('expired') > 0) {
            that.loginService.logout();// 退出登录
          }
          else {
            let error2 = error && error['error'];
            that.error = error2.errors && error2.errors[0].defaultMessage;
          }
        }
      })
  }

  // 新增子设备
  addDevice() {
    if (!this.device.name || this.device.name == '' || this.device.name == null) {
      this.error = '请输入设备编号！';
      return;
    } else if (!this.device.pname || this.device.pname == '' || this.device.pname == null) {
      this.error = '请输入网关编号！';
      return;
    }
    this.subDevice.deviceName = this.device.name.trim();
    this.subDevice.parentName = this.device.pname.trim();
    this.subDevice.modelId = this.currentModel.id;

    const that = this; 
    this.subDeviceService.addDevice(that.subDevice)
      .subscribe({
        next: function () {
          that.binding = 1;
          that.countDowmFun(); // 倒计时
        },
        complete: function () {

        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('expired') > 0) {
            that.loginService.logout();// 退出登录
          }
          else {
            let error2 = error && error['error'];
            that.error = error2.errors && error2.errors[0].defaultMessage;
          }
        }
      })
  }

  // 网关
  gtChnage() {
    this.gwdevice.online = '';
  }

  //  产品型号
  // deviceTypeChange(currentModel) {
  //   this.currentModel = currentModel;
  // }

  // gwdeviceTypeChange(currentGWModel) {
  //   this.currentGWModel = currentGWModel;
  // }



// 继续绑定安装点
  goToDevicePositionPage() {
    this.binding = 0;
    this.countDown = 5; // 计时
    this.navCtrl.push(SubDevicePositionPage, { deviceName: this.device.name, devicePname: this.device.pname, pmodelId: this.currentGWModel.id, modelId: this.currentModel.id} );
  }

  // 倒计时
  countDowmFun() {
    const timer1 = setTimeout(() => {
      this.getSubDeviceByName(this.device.name);
    }, 1000);
    const timer = setInterval(() => {
      this.countDown--;
      if (this.countDown == 0) {
        this.binding = 2;
        clearInterval(timer);
        clearInterval(timer1);
      }
    }, 1000);
  }

}
