import {NgModule} from "@angular/core";
import {IframeComponent} from "./iframe.component";
import {CommonModule} from "@angular/common";
import { SharedModule } from 'src/app/shared/shared.module';
import { IconDirective } from 'src/app/shared/icon/icon.directive';
import { TooltipDirective } from 'src/app/shared/tooltip/tooltip.directive';
import {AvatarComponent} from "../../../shared/avatar/avatar.component";
import { CheckboxComponent } from '../../../shared/checkbox/checkbox.component';

@NgModule({
  declarations: [IframeComponent],
  imports: [CommonModule, SharedModule, IconDirective, TooltipDirective, AvatarComponent, CheckboxComponent],
  exports: [IframeComponent]
})
export class IframeModule {}
