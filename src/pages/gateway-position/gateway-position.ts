import { Component, ViewChild, ElementRef ,} from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GatewayService } from '../../service/device-position.service';
import { LoginService } from '../../service/login.service';
import { SubDeviceService } from '../../service/sub-device.service'


// baidu map
declare var BMap;
declare let BMAP_ANCHOR_TOP_LEFT;



/**
 * Generated class for the GatewayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-gateway-position',
    templateUrl: 'gateway-position.html',
})
export class GatewayPositionPage{
  @ViewChild('map5') map_container: ElementRef;
  position: any = {}; // 存储数据;
  coordsPoint: any = {}; // 定位;
  gateway: any = {
    "deviceName" : '',
    "positionId" :  null,
    "modelId": null
  }; // 存储数据;
  map: any; // 地图
  platform: string;
  error: string; // 错误
  binding = 0; // 按钮
  scantext: string; // 二维码
  addr = ''; // 地址
  deviceGWModels = []; // 网关型号
  currentGWModel: any = {} // 当前网关型号
  deviceType = 1; // 网关类型


  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loginService: LoginService,
    public gatewayService: GatewayService,
    private geolocation: Geolocation,
    private subDeviceService: SubDeviceService,
    // private qrScanner: QRScanner,
     ) {

    this.coordsPoint.lng = '113.977144';
    this.coordsPoint.lat = '22.544109';


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GatewayPage');
    this.addBeiduMap();
    this.getModelsByType();
  }

  ionViewDidEnter() {
    this.gateway.deviceName = this.scantext = this.navParams.get('scantext') || '';
    this.getGPS();
    // this.getLocation();
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      console.log("navigator.geolocation works well");
    }

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

  //  产品型号
  deviceTypeChange(currentModel) {
    console.log(currentModel);
  }

  // 百度地图API功能
  addBeiduMap() {
    let map = this.map = new BMap.Map(this.map_container.nativeElement, { enableMapClick: true });//创建地图实例
    // map.centerAndZoom("广州",17); //设置城市设置中心和地图显示级别
    // const point = new BMap.Point(113.923497, 22.497311); // 坐标可以通过百度地图坐标拾取器获取 --万融大厦
    const point = new BMap.Point(113.977144, 22.544109); // 坐标可以通过百度地图坐标拾取器获取 --深圳世界之窗
    map.centerAndZoom(point, 17);//设置中心和地图显示级别
    // let sizeMap = new BMap.Size(10, 80);//显示位置
    const offset = new BMap.Size(16, 16);
    const navigationControl = new BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      offset: offset,
    });
    map.addControl(navigationControl);
    map.enableScrollWheelZoom(true);//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom(true);//连续缩放效果，默认禁用
    // this.addMarker();
    // this.getGPS();
    // this.getLocation();

  }

  // 二维码
  qrScanners() {
    this.navCtrl.push('ScanPage');
  }


 // 获取定位
  public getGPS() {
    console.log('获取定位！')
    const that = this;
    this.geolocation.getCurrentPosition().then((resp) => {
      if (resp && resp.coords) {
        console.log(resp.coords.latitude, resp.coords.longitude);
        let locationPoint = new BMap.Point(resp.coords.longitude, resp.coords.latitude);
        // that.addMarker(locationPoint);
        that.convertor(locationPoint); // 位置转换
        that.getPoint(locationPoint); // 逆地址解析
      }
    }).catch((error) => {
      console.log('Error getting location', error);
      that.error = '定位失败';
    });

  }

  // 逆地址解析
  getPoint(pt) {
  // 创建地址解析器实例
    const that = this;
    var myGeo = new BMap.Geocoder();
    myGeo.getLocation(pt, function (rs) {
      var addComp = rs.addressComponents;
      that.addr = addComp.province + ", " + addComp.city + ", " + addComp.district;
      if (addComp.street) {
        that.addr = that.addr + ", " + addComp.street ;
      }
      if (addComp.streetNumber) {
        that.addr = that.addr + ", " + addComp.streetNumber;
      }
      // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
    });  
  }
// 位置转换
  convertor(locationPoint) {
    let convertor = new BMap.Convertor();
    let pointArr = [];
    pointArr.push(locationPoint);
    convertor.translate(pointArr, 1, 5, (data) => {
      if (data.status === 0) {
        let myIcon = new BMap.Icon('../../assets/imgs/gps.png', new BMap.Size(32, 32));;
        let marker = new BMap.Marker(data.points[0], { icon: myIcon });
        this.map.panTo(data.points[0]);
        marker.setPosition(data.points[0]);
        this.map.clearOverlays();//清除覆盖物
        this.map.addOverlay(marker);
        console.log(data);
      }
    })
    this.map.centerAndZoom(locationPoint, 17);

  }

  // 地址转换
  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      if (resp && resp.coords) {
        let locationPoint = new BMap.Point(resp.coords.longitude, resp.coords.latitude);
        let convertor = new BMap.Convertor();
        let pointArr = [];
        pointArr.push(locationPoint);
        convertor.translate(pointArr, 1, 5, (data) => {
          if (data.status === 0) {
            let myIcon = new BMap.Icon('../../assets/imgs/gps.png', new BMap.Size(32, 32));;
            let marker = new BMap.Marker(data.points[0], { icon: myIcon });
            this.map.panTo(data.points[0]);
            marker.setPosition(data.points[0]);
            this.map.addOverlay(marker);
          }
        })
        this.map.centerAndZoom(locationPoint, 17);
        console.log('GPS定位：您的位置是 ' + resp.coords.longitude + ',' + resp.coords.latitude);
      }
    }).catch(e => {
      console.log('Error happened when get current position.');

    });

  }


  // 添加标注
  addMarker(point){
    // const name = item.name;
    // 添加自定义覆盖物
    let myIcon = new BMap.Icon('../../assets/imgs/gps.png', new BMap.Size(32, 32));;
    let marker = new BMap.Marker(point, { icon: myIcon });
    this.map.panTo(point);
    marker.setPosition(point);
    this.map.clearOverlays();//清除覆盖物
    this.map.addOverlay(marker);

 }

  // 获取位置信息
  getPosition (name, flag) {
    name = name && name.trim();
    const that = this;
    this.gatewayService.getPositionByNumber(name)
    .subscribe({
      next: function (val) {
        console.log(val)
        that.position.name = val.name;
        that.gateway.positionId = val.id;
        that.gateway.modelId = that.currentGWModel.id;
        that.position.point = `${val.point.lng} , ${val.point.lat}`;
        const point = new BMap.Point(val.point.lng, val.point.lat);
        that.map.centerAndZoom(point, 17);
        // myIcon.setAnchor(new BMap.Size(16, 38));
        const marker = new BMap.Marker(point);  // 创建标注
        that.map.clearOverlays();//清除覆盖物
        that.map.addOverlay(marker); // 添加覆盖物
        
      },
      complete: function() {
        if (flag) {
          that.bindPositionApi(that.gateway); // 绑定网关位置
        }

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


  valueChange(e) {
    this.error = '';
  }



  bindPositionApi (body){
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

  // 绑定网关位置
  bindPosition() {
    if (!this.position.id || this.position.id == '' || this.position.id == null) {
      this.error = '请输入安装点编号！';
      return;
    } else if (!this.gateway.deviceName || this.gateway.deviceName == '' || this.gateway.deviceName == null) {
      this.error = '请输入网关编号！';
      return;
    }

    this.gateway.deviceName = this.gateway.deviceName.trim();
    this.position.id = this.position.id.trim();


    this.getPosition(this.position.id,true);

  }
  // 获取设备信息
  getDeviceByName () {

  }
  bindOver() {
    this.binding = 0;
    this.gateway.deviceName = '';

  }



}
