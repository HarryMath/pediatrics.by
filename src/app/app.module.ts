import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AvatarComponent } from 'src/app/avatar/avatar.component';
import {EventCreateModule} from "./events/event-create/event-create.module";

@NgModule({
  declarations: [
    AppComponent,
    DoctorComponent,
  ],
  imports: [
    AvatarComponent,
    BrowserModule,
    EventCreateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
