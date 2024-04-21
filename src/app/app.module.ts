import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AvatarComponent } from 'src/app/shared/avatar/avatar.component';
import { IframeModule } from './components/events/event-create/iframe.module';
import { IconDirective } from './shared/icon/icon.directive';
import { PhoneComponent } from './phone/phone.component';
import { MenuComponent } from './commons/menu/menu.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './commons/header/header.component';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing-page.component').then(m => m.LandingPageComponent),
  },
  {
    path: 'цены',
    pathMatch: 'prefix',
    loadComponent: () => import('./pages/prices/price-page.component').then(m => m.PricePageComponent),
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    PhoneComponent,
    MenuComponent
  ],
  imports: [
    AvatarComponent,
    BrowserModule,
    IframeModule,
    IconDirective,
    RouterModule.forRoot(routes),
    HeaderComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
