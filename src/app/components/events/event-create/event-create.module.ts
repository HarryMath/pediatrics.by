import {NgModule} from "@angular/core";
import {EventCreateComponent} from "./event-create.component";
import {CommonModule} from "@angular/common";
import { SharedModule } from 'src/app/shared/shared.module';
import { IconDirective } from 'src/app/shared/icon/icon.directive';
import { TooltipDirective } from 'src/app/shared/tooltip/tooltip.directive';
import { SelectDateComponent } from 'src/app/shared/date/select-date.component';
import {AvatarComponent} from "../../../shared/avatar/avatar.component";

@NgModule({
  declarations: [EventCreateComponent],
    imports: [CommonModule, SharedModule, IconDirective, TooltipDirective, AvatarComponent],
  exports: [EventCreateComponent]
})
export class EventCreateModule {}
