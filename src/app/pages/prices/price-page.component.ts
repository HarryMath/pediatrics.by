import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateUtils } from '../../shared/utils/date.utils';
import { NgForOf } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: 'price-page.component.html',
  styleUrls: ['price-page.component.css'],
  imports: [
    NgForOf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricePageComponent {

  priceList = [
    {
      group: 'Педиатр',
      items: [
        { name: 'Первичный прием педиатра', price: 40 },
        { name: 'Повторный прием педиатра', price: 32 },
      ],
    },
    {
      group: 'Невролог',
      items: [
        { name: 'Первичный прием невролога', price: 40 },
        { name: 'Повторный прием невролога', price: 32 },
      ],
    },
    {
      group: 'Аллерголог',
      items: [
        { name: 'Прием аллерголога', price: 40 },
      ],
    },
    {
      group: 'Психолог',
      items: [
        { name: 'Прием психолога', price: 60 }
      ],
    },
    {
      group: 'Травмотолог-Ортопед',
      items: [
        { name: 'Первичный прием', price: 40 },
        { name: 'Повторный прием', price: 32 },
      ],

    }
  ];

  programs = [];

  getDate(): string {
    return DateUtils.toString(new Date());
  }
}
