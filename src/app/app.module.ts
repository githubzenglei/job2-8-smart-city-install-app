import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { QRScanner } from '@ionic-native/qr-scanner';
import { MyApp } from './app.component';
import { JwtModule, } from '@auth0/angular-jwt';
import { IonicStorageModule } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { HomePageModule } from '../pages/home/home.module';
import { ScanPageModule } from '../pages/scan/scan.module';
import { GatewayPositionPageModule } from '../pages/gateway-position/gateway-position.module';
import { SubdevicePageModule } from '../pages/sub-device/sub-device.module';
import { DevicePositionPageModule } from '../pages/device-position/device-position.module';
import { SubDevicePositionPageModule } from '../pages/sub-device-position/sub-device-position.module';
import { ModalPageModule } from '../pages/modal-page/modal-page.module';
import { IndexPopoverPageModule } from '../pages/index-popover/index-popover.module';
import { InstallHistoryPageModule } from '../pages/install-history/install-history.module';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServiceModule } from '../service/service.module';
import { httpInterceptorProviders } from '../interceptor/index';
export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    }
  }
}
export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,

  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),

    IonicModule.forRoot(MyApp),
    HomePageModule,
    ServiceModule,
    ModalPageModule,
    GatewayPositionPageModule,
    SubdevicePageModule,
    SubDevicePositionPageModule,
    DevicePositionPageModule,
    InstallHistoryPageModule,
    IndexPopoverPageModule,
    ScanPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    // QRScannerOriginal,
    QRScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    httpInterceptorProviders,
  ]
})
export class AppModule {}
