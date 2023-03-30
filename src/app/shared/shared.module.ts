import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from 'src/app/shared/input/input.component';
import { SearchInputComponent } from 'src/app/shared/search-input/search-input.component';

@NgModule({
  imports: [CommonModule],
  declarations: [InputComponent, SearchInputComponent],
  exports: [InputComponent, SearchInputComponent]
})
export class SharedModule {

}
