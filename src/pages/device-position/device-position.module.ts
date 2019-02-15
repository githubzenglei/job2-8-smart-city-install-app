import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevicePositionPage } from './device-position';

@NgModule({
  declarations: [
    DevicePositionPage,
  ],
  imports: [
    IonicPageModule.forChild(DevicePositionPage),
  ],
})
export class DevicePositionPageModule {}
