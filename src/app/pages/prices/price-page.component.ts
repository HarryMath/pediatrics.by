import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DateUtils } from '../../shared/utils/date.utils';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { IconDirective } from '../../shared/icon/icon.directive';

@Component({
  standalone: true,
  templateUrl: 'price-page.component.html',
  styleUrls: ['price-page.component.css'],
  imports: [
    NgForOf,
    NgIf,
    IconDirective,
    NgStyle
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricePageComponent {

  private readonly changeDate = new Date(2024, 2 - 1, 1, 0);
  showNew = document.location.href.includes('new');

  private readonly priceListOld = [
    {
      group: 'Педиатр',
      items: [
        { name: 'Первичный прием педиатра', price: 50 },
        { name: 'Повторный прием педиатра', price: 45 },
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
        { name: 'Прием аллерголога', price: 80 },
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

  private readonly priceListNew = [
    {
      group: 'Аллергология',
      items: [
        { name: 'Прием врача-аллерголога-иммунолога', price: 80 },
      ],
    },
    {
      group: 'Неврология',
      items: [
        { name: 'Первичный прием врача-детского-невролога', price: 50 },
        { name: 'Повторный прием врача-детского-невролога', price: 45 },
        { name: 'Первичный прием врача-детского-невролога, сотрудника кафедры БелМАПО (40 минут)', price: 60 },
      ],
    },
    {
      group: 'Педиатрия',
      items: [
        { name: 'Выдача справки формы 1здр/у', price: 5 },

        { name: 'Выезд врача-педиатра на дом в пределах МКАД и до 5 км от МКАД', price: 100 },
        { name: 'Выезд врача-педиатра на дом за пределы МКАД от 5 до 20 км от МКАД', price: 140 },

        { name: 'Консультация врача-педиатра по вакцинации с выдачей плана вакцинации и формы 063/у', price: 55 },
        { name: 'Консультация врача-педиатра по вакцинации с выдачей паспорта формы 063/у', price: 30 },
        { name: 'Прием врача-педиатра, директора клиники', price: 60 },
        { name: 'Первичный прием врача-педиатра', price: 50 },
        { name: 'Повторный прием врача-педиатра', price: 40 },
        { name: 'Диагностика стрептококка экспресс тестом**', price: 20 },
      ],
    },
    {
      group: 'Психология',
      items: [
        { name: 'Детско-родительская консультация психолога', price: 75 }
      ],
    },
    {
      group: 'Ортопедия',
      items: [
        { name: 'Первичный прием врача-травматолога-ортопеда', price: 50 },
        { name: 'Повторный прием врача-травматолога-ортопеда', price: 45 },
      ],
    },
    {
      group: 'Программы',
      items: [
        { name: '365 вопросов (возраст до 1 года, врач-педиатр, директор клиники)', price: 1980 },
        { name: '365 вопросов (возраст до 1 года, врач-педиатр)', price: 1680 },
        { name: 'Личный педиатр (возраст от 1 года, врач-педиатр)', price: 1140 },
        { name: 'У меня вопрос (возраст от 1 года, врач-педиатр, директор клиники)', price: 495 },
        { name: 'У меня вопрос (возраст от 1 года, врач-педиатр)', price: 444 },
        { name: 'Рука на пульсе', price: 360 },
      ],
    }
  ];

  isChangeDatePassed = new Date().getTime() > this.changeDate.getTime();

  priceList = this.isChangeDatePassed
    ? this.priceListNew
    : this.priceListOld;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  getChangeDate(): string {
    return DateUtils.toString(this.changeDate);
  }

  getActualDate(): string {
    return this.isChangeDatePassed || this.showNew
      ? this.getChangeDate()
      : '01.02.2024';
  }

  viewOld() {
    this.showNew = false;
    this.priceList = this.priceListOld;
  }

  viewNew() {
    this.showNew = true;
    this.priceList = this.priceListNew;
    this.cdr.markForCheck();
  }
}
