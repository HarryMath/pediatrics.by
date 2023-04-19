import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AvatarComponent } from 'src/app/avatar/avatar.component';
import { EventCreateModule } from "./events/event-create/event-create.module";
import {NgOptimizedImage} from "@angular/common";
import {IconDirective} from "./shared/icon/icon.directive";
import {PhoneComponent} from "./phone/phone.component";
import { ProgramComponent } from './program/program.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    DoctorComponent,
    PhoneComponent,
    ProgramComponent,
    MenuComponent
  ],
  imports: [
    AvatarComponent,
    BrowserModule,
    EventCreateModule,
    NgOptimizedImage,
    IconDirective,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
