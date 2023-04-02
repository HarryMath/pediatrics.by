import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from 'src/app/shared/input/input.component';
import { SearchInputComponent } from 'src/app/shared/search-input/search-input.component';
import { AvatarComponent } from "../avatar/avatar.component";
import { SelectDateComponent } from "./date/select-date.component";

@NgModule({
  imports: [CommonModule, AvatarComponent],
  declarations: [InputComponent, SearchInputComponent, SelectDateComponent],
  exports: [InputComponent, SearchInputComponent, SelectDateComponent]
})
export class SharedModule {

}
