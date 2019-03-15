import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GatewayService } from '../../service/device-position.service';

import { LoginService } from '../../service/login.service';
// baidu map
declare var BMap;
declare let BMAP_ANCHOR_TOP_LEFT;

/**
 * Generated class for the DevicePositionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-device-position',
  templateUrl: 'device-position.html',
})

export class DevicePositionPage {
  @ViewChild('map7') map_container: ElementRef;
  position: any = {}; // 存储位置数据;
  gateway: any = {}; // 存储网关数据;
  subdevice: any = {
    "deviceName": '',
    "positionId": null,
    "modelId": null
  }; // 存储子设备数据;
  map: any; // 地图
  error: string; // 错误码
  deviceName: string; // 子设备编号
  devicePname: string; // 设备编号
  pointTypeList = [{
    id: 'other',
    name: '其他'

  },
  { id: 'gateway', name: '网关' }
  ];
  pointType: any; // 当前类型
  binding = 0; // 按钮
  gwmodelId: any; // 设备型号
  gwmodelIdName = ''; 


  constructor(public navCtrl: NavController,
    public navParams: NavParams,

    public gatewayService: GatewayService,
    public loginService: LoginService,
  ) {

    this.pointType = this.pointTypeList[1];
    this.deviceName = navParams.get('deviceName');
    this.subdevice.deviceName = navParams.get('deviceName');
    this.subdevice.modelId = navParams.get('modelId');
    this.gwmodelId = navParams.get('modelId');
    this.gwmodelIdName = navParams.get('modelIdName');
    console.log(this.gwmodelId);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicePositionPage');
    this.addBeiduMap();


  }


  ionViewDidEnter() {
    this.binding = 0;
    this.getPositionByDeviceName(this.deviceName, this.gwmodelId);

  }

  valueChange(e) {
    this.error = '';
  }


  // 百度地图API功能
  addBeiduMap() {

    let map = this.map = new BMap.Map(this.map_container.nativeElement, { enableMapClick: true });//创建地图实例

    // map.centerAndZoom("广州",17); //设置城市设置中心和地图显示级别
    const point = new BMap.Point(113.923497, 22.497311); // 坐标可以通过百度地图坐标拾取器获取 --万融大厦
    map.centerAndZoom(point, 17);//设置中心和地图显示级别

    // let sizeMap = new BMap.Size(10, 80);//显示位置
    const offset = new BMap.Size(16, 16);
    const navigationControl = new BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      offset: offset,
    });
    map.addControl(navigationControl);
    // map.addControl(new BMap.NavigationControl());
    map.enableScrollWheelZoom(true);//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom(true);//连续缩放效果，默认禁用



  }
  // 下拉框
  pointTypeChange(index) {
    // this.pointType = index;
    if (index.id == 'other') {
      this.position.number = '';
      this.position.name = '';
      this.position.point = '';
    } else {
      this.position.name = this.gateway.name;
      this.position.number = this.gateway.number;
      this.position.point = `${this.gateway.point.lng} , ${this.gateway.point.lat}`;
      this.subdevice.positionId = this.gateway.id;
      const point = new BMap.Point(this.gateway.point.lng, this.gateway.point.lat);
      this.map.centerAndZoom(point, 17);
      // myIcon.setAnchor(new BMap.Size(16, 38));
      const marker = new BMap.Marker(point);  // 创建标注
      this.map.clearOverlays();//清除覆盖物
      this.map.addOverlay(marker);
    }
  }

  // 绑定位置
  bindPositionApi(body) {
    const that = this;
    this.gatewayService.bindPosition(body)
      .subscribe({
        next: function (val) {
          console.log(val)
        },
        complete: function () {
          that.binding = 2;  // 完成
          // that.countDowmFun(); // 倒计时
        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('Access Denied') > 0) {
            that.loginService.logout();// 退出登录
          }
          else {
            let error2 = error && error['error'];
            that.error = error2.errors && error2.errors[0].defaultMessage;
          }
        }
      })
  }
  bindPosition() {
    if (!this.position.name || this.position.name == '' || this.position.name == null) {
      this.error = '请输入安装点编号！';
      return;
    }
    this.bindPositionApi(this.subdevice)
  }

  // 获取网关位置详情 PositionByDeviceNumber
  getPositionByDeviceName(name, type) {
    const that = this;
    this.gatewayService.getPositionByDeviceName(name, type)
      .subscribe({
        next: function (val) {
          console.log(val)
          that.gateway = val;
          that.subdevice.positionId = val.id; // positionId
          that.position.name = val.name;
          that.position.number = val.number;
          that.position.point = `${val.point.lng} , ${val.point.lat}`;
          const point = new BMap.Point(val.point.lng, val.point.lat);
          that.map.centerAndZoom(point, 17);
          // myIcon.setAnchor(new BMap.Size(16, 38));
          const marker = new BMap.Marker(point);  // 创建标注
          that.map.clearOverlays();//清除覆盖物
          that.map.addOverlay(marker);

        },
        complete: function () {

        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('Access Denied') > 0) {
            that.loginService.logout();// 退出登录
          }

          else {
            let error2 = error;
            that.error = error['error'].message;
            console.log(error2)
          }
        }
      })
  }

  // 获取位置详情 PositionByNumber
  getPosition(id) {
    const that = this;
    this.gatewayService.getPositionByNumber(id)
      .subscribe({
        next: function (val) {
          console.log(val)
          that.subdevice.positionId = val.id; // positionId
          that.position.name = val.name;
          // that.position.point = JSON.stringify(val.point);
          that.position.point = `${val.point.lng} , ${val.point.lat}`;
          const point = new BMap.Point(val.point.lng, val.point.lat);
          that.map.centerAndZoom(point, 17);
          // myIcon.setAnchor(new BMap.Size(16, 38));
          const marker = new BMap.Marker(point);  // 创建标注
          that.map.clearOverlays();//清除覆盖物
          that.map.addOverlay(marker);

        },
        complete: function () {

        },
        error: function (error) {
          console.log(error)
          if (error['error'].message && error['error'].message.indexOf('Access Denied') > 0) {
            that.loginService.logout();// 退出登录
          }

          else {
            let error2 = error && error['error'];
            that.error = error2.errors && error2.errors[0].defaultMessage;

          }
        }
      })
  }



  bindOver() {

    this.popView();
  }


  popView() {
    this.navCtrl.pop();
  }

}