import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { DoctorDto } from '../../sdk/dto/Doctor';
import { EventsService } from '../../components/events/events.service';
import { mobileWidth, random, remToPX, toRadians, wait } from '../../shared/utils';
import { ScheduleSdk } from '../../sdk/schedule.sdk';
import { NgClass, NgForOf, NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { IconDirective } from '../../shared/icon/icon.directive';
import { DoctorComponent } from '../../components/doctor/doctor.component';
import { ProgramComponent } from '../../components/program/program.component';
import { HeaderComponent } from '../../commons/header/header.component';

const HEART_SIZE_REM = 12;

interface IService {
  name: string;
  label: string;
  includes: string[];

  isOpened?: boolean;
}

interface IPrice {
  val: number;
  label?: string;
}

export interface IProgram {
  name: string;
  minPrice: string;

  price: IPrice[];
  payOptions?: string;

  icon: string;
  includes: {
    label?: string;
    includes: string[];
  }[];

  main: string[];
}

interface IInstagramPost {
  photoUrl: string;
}

interface IAdvantage {
  name: string;
  description: string;
  icon: string;
}

interface IDoctor {
  photo: string;
  name: string;
  type: string;
  info: string[];
}

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: 'landing-page.component.html',
  imports: [
    NgIf,
    IconDirective,
    NgForOf,
    NgClass,
    NgOptimizedImage,
    DoctorComponent,
    NgTemplateOutlet,
    ProgramComponent,
    HeaderComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  services: IService[] = [
    {
      name: 'Для детей',
      label: 'Ребенок чувствует себя на приеме комфортнее, если знает доктора и процедуру осмотра.',
      includes: [
        'Консультации врачей-специалистов (педиатр, невролог, ортопед, аллерголог)',
        'Годовые программы обслуживания',
        'Ежегодный осмотр здоровых детей',
        'Составление индивидуального плана вакцинации',
        'Вызов врача на дом'
      ],
      isOpened: true
    },
    {
      name: 'Для будущих родителей',
      label: 'Мы рекомендуем выбрать врача-педиатра своему долгожданному малышу заранее. На дородовой консультации вы можете:',
      includes: [
        'Получить информацию по уходу за новорожденным',
        'Составить план необходимых покупок для малыша',
        'Узнать о грудном вскармливании, особенностях периода кормления',
      ]
    },
    {
      name: 'Для родителей',
      label: 'Стараемся помочь всей семье, сохраняя психологический комфорт и здоровье каждого:',
      includes: [
        'Консультация врача-терапевта',
        'Помощь с грудным вскармливанием',
        'Обучение уходу за новорожденным ребенком',
        'Обучающие семинары'
      ]
    },
    {
      name: 'Для взрослых',
      label: 'Да, если вы недавно стали взрослым ребенком или довольно давно взрослый без детей — мы готовы предоставить вам:',
      includes: ['Консультацию аллерголога']
    }
  ];

  advantages: IAdvantage[] = [
    {
      name: 'УСПОКОИМ ТРЕВОЖНЫХ РОДИТЕЛЕЙ',
      description: 'Мы разговариваем с родителями на одном языке  и с хорошим настроением',
      icon: 'calm.png'
    },
    {
      name: 'ИНДИВИДУАЛЬНЫЙ ПОДХОД',
      description: 'Мы знаем, что каждый человек уникален и ищем общий язык',
      icon: 'individual.png'
    },
    {
      name: 'СОВРЕМЕННОЕ ОБРАЗОВАНИЕ',
      description: 'Мы постоянно обновляем свои знания на основании актуальных рекомендаций',
      icon: 'education.png'
    },
    {
      name: 'КОЛЛЕКТИВ ЕДИНОМЫШЕННИКОВ',
      description: 'Наши специалисты работают в едином ключе, без противоречий',
      icon: 'friendly.png'
    }
  ];

  programs: IProgram[] = [
    {
      name: '365 вопросов первого года жизни',
      minPrice: 'от 1470 BYN / год',
      price: [
        { val: 1680, label: '(Дубатовка Н. Д.)' },
        { val: 1470, label: '(Рыбакова Н.В., Науменко А. Б.)'}
      ],
      main: [
        'Связь с педиатром',
        'Регулярные осмотры',
        'Индивидуальный план действий на год',
        'Обучение родителей уходу за малышом'
      ],
      includes: [
        {
          includes: [
            '12 плановых посещений врача-педиатра в Клинике',
            '2 вызова на дом',
            '4 плановых посещения врача-травматолога-ортопеда',
            '4 плановых посещения врача-детского невролога',
            '1 плановое посещение врача-аллерголога-иммунолога',
            'Посещение врача-педиатра и узких специалистов может быть заменено на посещение любого специалиста Клиники'
          ]
        },
        {
          label: 'В период действия программы «365 вопросов» в рамках консультации врача-педиатра Пациенту предоставляется:',
          includes: [
            'Онлайн связь с личным врачом-педиатром с 9.00 до 22.00 ежедневно, посредством мобильных звонков, а также мессенджера Telegram/Viber',
            'Обучение основным навыкам родительства, помощь по всем возникающим вопросам',
            'Консультация по введению прикорма с предоставлением информационного материала',
            'Помощь с расшифровкой результатов анализов',
            'Составление индивидуального календаря вакцинации с выдачей паспорта вакцинации по форме 063/у'
          ]
        }
      ],
      payOptions: '*возможна оплата в 2 этапа',
      icon: '365',
    },
    {
      name: 'Все включено',
      minPrice: '1140 BYN / год',
      price: [{ val: 1140 }],
      main: [
        'Связь с педиатром',
        'Осмотры в клинике и на дому',
        'Составление индивидуальной программы наблюдения, вакцинации',
      ],
      includes: [{
        includes: [
          '12 посещений врача-педиатра в Клинике',
          '2 вызова на дом',
          '5 плановых посещений врачей специалистов в Клинике (врача-травматолога-ортопеда, или врача-детского невролога, или врача-аллерголога-иммунолога)',
          'Cоставление индивидуального плана осмотров, исследований, анализов, вакцинации',
          'Онлайн связь с личным врачом-педиатром с 9.00 до 22.00 ежедневно, посредством мобильных звонков, а также мессенджера Telegram/Viber',
          'Рекомендации по питанию и образу жизни',
          'Помощь с расшифровкой результатов анализов',
          'Составление индивидуального плана вакцинации с выдачей паспорта прививок по форме 063/у',
          'Выдача по результатам проведения необходимых осмотров и предоставления необходимой информации справок в бассейн, на кружки и развивающие занятия'
        ]
      }],
      payOptions: '*возможна оплата в 2 этапа',
      icon: 'all_in',
    },
    {
      name: 'Рука на пульсе',
      minPrice: '315 BYN / год',
      price: [{ val: 315 }],
      main: [
        '9 посещений любого врача медицинского центра (не включает вызов на дом)',
        'Рекомендации по питанию и образу жизни',
        'Помощь с расшифровкой результатов анализов',
      ],
      includes: [{
        includes: [
          '9 посещений любых врачей специалистов клиники',
          'Рекомендации по питанию и образу жизни',
          'Помощь с расшифровкой результатов анализов',
          'Выдача по результатам проведения необходимых осмотров и предоставления необходимой информации справок в бассейн, на кружки и развивающие занятия'
        ]
      }],
      icon: 'pulse',
    }
  ];

  appearElements: SVGElement[] = [];

  doctors: DoctorDto[] = [];

  isMobile: boolean;

  constructor(
    readonly eventsService: EventsService,
    readonly cdr: ChangeDetectorRef,
  ) {
    this.isMobile = innerWidth <= mobileWidth;
  }

  ngOnInit(): void {
    console.count('init app-component');
    this.buildHead();
    this.loadDoctors();
    setTimeout(() => {
      this.appearElements = Array.from(document.querySelectorAll('.p-icon')).map(el => el.querySelector('svg')!)
        .concat(Array.from(document.querySelectorAll('.adv-icon')));
    }, 100);
  }

  ngAfterViewInit() {
    document.querySelectorAll<HTMLDivElement>('.p-head')[1].style.cssText = 'background-color: #8fffb5';
    setTimeout(() => this.prepareServices(), 1000);
  }

  async buildHead(): Promise<void> {
    const container = document.getElementById('back0')!;
    const rect = container.getBoundingClientRect();
    const hearSize = remToPX(HEART_SIZE_REM);
    const amountX = Math.round(rect.width / hearSize);
    const amountY = Math.round(rect.height / hearSize);
    const offsetSize = hearSize / 8;

    let hearts = '';
    let t, tLeft = 0, tRight = 0;
    for (let i = 0; i <= amountX; i++) {
      for (let j = 0; j <= amountY; j++) {
        if (innerWidth > mobileWidth + 50) {
          t = 200 + (i + j) * 50 + Math.random() * ((i * j) * 20 + 300);
          tLeft = t + Math.random() * 400 - 200;
          tRight = t + Math.random() * 400 - 200;
        }
        const rotation = random(0, 360);
        const translateX = (i - 0.34 * (j % 3)) * hearSize + random(-offsetSize, offsetSize);
        const translateY = j * hearSize + random(-offsetSize, offsetSize);
        const d = random(0, hearSize / 10);
        const d2 = random(-hearSize / 10, hearSize / 10)
        const dx = d * Math.cos(rotation * toRadians)
          + d2 * Math.cos((rotation - 90) * toRadians);
        const dy = d * Math.sin(rotation * toRadians)
          + d2 * Math.sin((rotation - 90) * toRadians);
        // hearts += `<svg class="heart" style="transform:translate(${translateX}px,${translateY}px) rotate(${random(0, 360)}deg)"><use xlink:href="#like"></use></svg>`
        hearts += '<div class="h-wrap">'
          + `<div class="heart l1" style="transition-delay:${tLeft}ms;transform:translate(${translateX - dx}px,${translateY - dy}px) rotate(${rotation}deg)"></div>`
          + `<div class="heart l2" style="transition-delay:${tRight}ms;transform:translate(${translateX + dx}px,${translateY + dy}px) rotate(${rotation + random(-40, 10)}deg)"></div>`
          + '</div>'
      }
    }
    container.innerHTML += hearts;

    const baby = document.getElementById("baby")!;
    if (innerWidth <= 650) {
      const size = innerWidth - remToPX(4);
      baby.style.cssText = `width: ${size}px;height:${size * 1.3}px`
    }

    await wait(100);
    document.querySelectorAll<HTMLDivElement>('.heart').forEach(h => h.style.opacity = '1');
  }

  @HostListener('window:resize')
  prepareServices(): void {
    this.services.forEach(s => {
      const div = document.getElementById('service_' + s.name)!;
      this.updateService(s.isOpened || false, div);
    })
    this.cdr.markForCheck();
  }

  toggleService(s: IService): void {
    const div = document.getElementById('service_' + s.name)!;
    if (!s.isOpened) {
      s.isOpened = true;
      this.cdr.detectChanges();
      setTimeout(() => this.updateService(true, div), 10);
    } else {
      this.updateService(false, div);
      setTimeout(() => {
        s.isOpened = false;
        this.cdr.markForCheck();
      }, 200);
    }
  }

  private isHeaderVisible = false;
  private touchedFooter = false;

  @HostListener('window:scroll')
  handleScroll(): void {
    const isHeaderVisible = window.scrollY > 230;
    if (isHeaderVisible !== this.isHeaderVisible) {
      this.isHeaderVisible = isHeaderVisible;
      document.getElementById('header')!.classList?.[isHeaderVisible ? 'add' : 'remove']('visible');
    }
    for (let i = 0; i < this.appearElements.length; i++) {
      const el = this.appearElements[i];
      if (el.classList.contains('visible')) {
        continue;
      }
      const rect = el.getBoundingClientRect();
      if (rect.top < innerHeight - 50 && rect.bottom > 10) {
        el.classList.add('visible');
        this.appearElements.splice(i--, 1);
        break;
      }
    }

    const footer = document.querySelector('footer')!;
    const rect = footer.getBoundingClientRect();

    const touchedFooter = rect.bottom < innerHeight * 1.2 + 45;
    if (this.touchedFooter !== touchedFooter) {
      this.touchedFooter = touchedFooter;
      document.getElementById('Контакты')!.classList?.[touchedFooter ? 'add' : 'remove']('end');
      document.getElementById('header')!.classList?.[touchedFooter ? 'add' : 'remove']('end');
      if (touchedFooter) {
        window.scrollTo({ behavior: "smooth", top: document.body.scrollHeight })
      }
    }
  }

  private updateService(isOpened: boolean, div: HTMLElement): void {
    const element = isOpened ?
      div.querySelector('.s-wrap')! :
      div.querySelector('.s-head')!;

    const h = element.getBoundingClientRect().height;
    div.style.cssText = `height: ${h}px`;
  }

  private async loadDoctors(): Promise<void> {
    try {
      this.doctors = await ScheduleSdk.doctors.get();
    } catch (e) {
      // TODO remove
    }
    this.doctors = this.doctors.sort((d1, d2) => (d1.lastName + d1.firstName).localeCompare(d2.lastName + d2.firstName));
    this.cdr.detectChanges();
    if (innerWidth < mobileWidth) {
      await wait(10);
      requestAnimationFrame(() => {
        const elements = Array.from(document.querySelectorAll<HTMLDivElement>('.doc-wrap'));
        const maxH = elements.reduce((max, el) => Math.max(max, el.clientHeight), 0);
        elements.forEach(el => {
          el.style.cssText = 'height:' + maxH + 'px';
          el.classList.add('ready');
        });
      });
    }
  }
}
