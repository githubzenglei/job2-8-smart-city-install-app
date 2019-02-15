import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InstallHistoryPage } from './install-history';

@NgModule({
  declarations: [
    InstallHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(InstallHistoryPage),
  ],
})
export class InstallHistoryPageModule {}
