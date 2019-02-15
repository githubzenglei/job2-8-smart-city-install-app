import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';
import { VideoService } from './video.sevice';
import { GatewayService } from './device-position.service';
import { SubDeviceService } from './sub-device.service';
import { HistoryService } from './history.service';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [LoginService, VideoService, GatewayService,
         SubDeviceService,
        HistoryService
        ]
})
export class ServiceModule { }
