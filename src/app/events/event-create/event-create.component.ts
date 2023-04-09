import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {Subscription} from 'rxjs';
import {EventsService} from 'src/app/events/events.service';
import {ScheduleSdk} from 'src/app/sdk/schedule.sdk';
import {getName, isMailValid, mobileWidth} from 'src/app/shared/utils';
import {ClientCreateDto, ClientDto} from 'src/app/sdk/dto/Client';
import {DoctorDto, DoctorMin, DoctorRole} from 'src/app/sdk/dto/Doctor';
import {TimestampInterval} from 'src/app/sdk/dto/Interval';
import {AvailableDoctor} from 'src/app/sdk/dto/Workday';
import {DateUtils} from 'src/app/shared/utils/date.utils';
import {ObjectUtils} from 'src/app/shared/utils/object.utils';
import {Time, TimeInterval, TimeUtils} from 'src/app/shared/utils/TimeInterval';
import {SelectOption} from 'src/app/shared/search-input/search-input.component';

const createClientDto = (): ClientCreateDto => ({
  birthDate: undefined,
  email: '',
  members: [],
  name: '',
  phones: [],
  primaryPhone: ''
});

interface Ticket {
  doctor: DoctorMin;
  time: TimestampInterval;
}

type PossibleEvent = Ticket[];

interface FreeDay {
  display: string;
  date: Date;
  intervals?: TimestampInterval[]; // for singe event
  doctors?: AvailableDoctor[]; // for multi event
}

const ANY_ROLE = 'Не выбрано';
const ANY_DOCTOR = 'Любой врач';
const ANY_DOCTOR_ID = 0;
let animationDuration = 200;

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./pop-up.css', './event-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCreateComponent implements OnDestroy, OnInit {

  step: 0 | 1 | 2 = 0;

  isVisible = false;
  isOpened = false;

  el?: ElementRef;
  subscription!: Subscription;

  clientId?: number;
  useEmail = false;
  client = createClientDto();

  doctorRole = '';
  doctorName = '';

  selectedDoctors: SelectOption<DoctorMin | DoctorRole>[] = [];

  selectedInterval = -1;
  selectedTicket = -1;
  doctor?: DoctorMin;
  start?: Date;
  end?: Date;
  day?: FreeDay;

  loadingDays = false;
  daysPage = 0;
  isLoadingSave = false;
  isLoadingStep = false;

  allRoles: SelectOption<DoctorRole>[] = [];
  doctors: SelectOption<DoctorMin>[] = [];

  @Input() set doctorsList(doctors: DoctorDto[]) {
    if (!doctors.length) {
      this.loadDoctors().catch();
      return;
    }
    this.doctors = doctors.map(d => {
      const name = d.lastName + ' ' + d.firstName + ' ' + d.fatherName;
      return {
        display: name,
        label: d.speciality,
        photoUrl: d.avatar,
        entity: { ...d, name }
      }
    });
    this.doctors.unshift({
      display: this.doctorRole?.length ? 'Любой ' +  this.doctorRole : ANY_DOCTOR,
      label: this.doctorRole,
      entity: { id: ANY_DOCTOR_ID, name: ANY_DOCTOR }
    })
    this.cdr.markForCheck();
  }

  days: FreeDay[] = [];
  possibleEvents: PossibleEvent[] = [];

  constructor(
    private readonly eventCreateService: EventsService,
    private readonly cdr: ChangeDetectorRef,
    // private readonly toast: ToastService,
  ) {
    animationDuration = innerWidth < mobileWidth ? 400 : 200;
    ScheduleSdk.doctors.getRoles().then(r => {
      this.allRoles = r.map(s => ({
        display: s,
        entity: s
      }));
      this.allRoles.push({ display: ANY_ROLE, entity: ANY_ROLE });
      this.cdr.markForCheck();
      // this.suitableOptions = this.getTagsDataList();
    })
  }

  ngOnInit(): void {
    if (!this.doctors.length) {
      this.loadDoctors().catch();
    }
    this.subscription = this.eventCreateService.subject.subscribe(input => {
      this.step = 0;
      this.clientId = undefined;
      this.doctorName = getName(input)
      this.doctorRole = input?.speciality || '';
      this.doctor = input;
      this.start = undefined;
      this.end = undefined;
      this.client = createClientDto();
      if (this.doctor) {
        this.isLoadingStep = true;
        this.daysPage = this.start ? DateUtils.getMothOffset(this.start) : 0;
        this.loadDays().then(() => {
          this.isLoadingStep = false;
          this.step = 1;
          this.cdr.markForCheck();
        });
      }
      this.openFullScreen();
    });
  }

  openFullScreen(): void {
    this.isVisible = true;
    this.cdr.markForCheck();
    requestAnimationFrame(() => {
      this.isOpened = true;
      this.cdr.markForCheck();
    })
  }

  async saveClient(): Promise<void> {
    if (this.isLoadingSave) {
      return;
    }
    if (!this.hasClientName()) {
      // this.toast.show('Заполните информацию о клинете', 0);
      alert('Заполните ФИО');
      return;
    }
    if (!this.hasClientIdentity()) {
      alert(this.useEmail ? 'Заполните Email' : 'Телефон');
      return;
    }
    this.isLoadingSave = true;
    this.cdr.markForCheck();
    try {
      const client = await ScheduleSdk.clients.save(this.client) as ClientDto | number;
      this.clientId = typeof client === 'number' ? client : client.id;
    } catch (e) {
      // this.toast.showError('Не удалось создать запись', e);
      alert('Не удалось создать запись');
    }
    this.isLoadingSave = false;
    this.cdr.markForCheck();
  }

  async save(): Promise<void> {
    if (this.isLoadingSave) {
      return;
    }
    if (!this.doctor?.id || !this.start || !this.end) {
      return;
    }
    if (!this.clientId) {
      await this.saveClient();
    }
    if (!this.clientId) {
      return;
    }
    this.isLoadingSave = true;
    this.cdr.markForCheck();
    try {
      const event = await ScheduleSdk.events.create({
        clientId: this.clientId,
        doctorId: this.doctor.id,
        start: this.start,
        end: this.end
      });
      // this.toast.show('Запись сохранена', 1);
      alert('Запись сохранена');
      this.close();
    } catch (e) {
      // this.toast.showError('Не удалось создать запись', e);
      alert('Не удалось создать запись');
    }
    this.isLoadingSave = false;
    this.cdr.markForCheck();
  }

  close(): void {
    this.isOpened = false;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.isVisible = false;
      this.clearRole();
      this.cdr.markForCheck();
    }, animationDuration);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async loadDoctors(doctorSearch?: string): Promise<void> {
    this.doctorsList = await ScheduleSdk.doctors.get(doctorSearch);
  }

  handleRoleSelect(role: DoctorRole): void {
    if (this.doctorRole !== role) {
      if (this.doctor?.id !== ANY_DOCTOR_ID) {
        this.clearDoctor();
      } else {
        console.log('set name;')
        this.doctor.name = 'Любой ' + role;
        this.doctor.speciality = role;
      }
      const anyDoctor = this.doctors.find(d => d.entity.id === ANY_DOCTOR_ID);
      if (anyDoctor) {
        console.log('set name;')
        anyDoctor.display = 'Любой ' + role;
        anyDoctor.entity.name = 'Любой ' + role;
      }
      this.doctorRole = role;
      this.cdr.markForCheck();
    }
  }

  handleDoctorSelect(doctor: DoctorMin): void {
    this.daysPage = 0;
    if (doctor.name === ANY_DOCTOR && doctor.id === ANY_DOCTOR_ID) {
      doctor.speciality = this.doctorRole;
    }
    this.doctor = doctor;
    this.doctorRole = doctor.speciality || '';
    this.day = undefined;
  }

  async loadDays(): Promise<void> {
    this.loadingDays = true;
    this.cdr.markForCheck();
    try {
      const intervals = await ScheduleSdk.doctors.getFreeDays(this.doctor!.id, this.daysPage);
      intervals.forEach(i => {
        i.start = new Date(i.start);
        i.end = new Date(i.end);
      })
      intervals.sort((i1, i2) => i1.start.getTime() - i2.start.getTime())

      this.days = [];
      let lastDay = '', currentDay = '';
      intervals.forEach(i => {
        currentDay = DateUtils.toString(i.start) + ', ' + DateUtils.getWeekDay(i.start);
        if (currentDay !== lastDay) {
          lastDay = currentDay;
          this.days.push({ date: i.start, display: lastDay, intervals: [] });
        }
        this.days[this.days.length - 1]!.intervals!.push(
          ...TimeUtils.splitByPeriods(i, this.doctor?.admissionMinutes || 30)
        );
      });
      console.log('days: ', this.days);
    } catch (e) {
      // this.toast.showError("Не удалось зугрузить расписание", e);
      alert("Не удалось загрузить расписание");
      console.log(e);
    }
    this.loadingDays = false;
    this.cdr.markForCheck();
  }

  handleDaySelect(day: FreeDay[]) {
    if (day.length != 1) {
      if (day.length > 1) {
        console.warn("error. days more than 1 in one day");
      }
      return;
    }
    this.day = day[0];
    this.clearTime();
    this.cdr.markForCheck();
  }

  getFullEventTime(): string {
    if (!this.day || !this.start) {
      return "";
    }
    return this.day.display + ', в ' + Time.fromDate(this.start).toString();
  }

  getStartString(t: TimestampInterval): string {
    return Time.fromDate(t.start).toString()
  }

  clearRole(): void {
    this.selectedDoctors = [];
    this.doctorRole = ''
    this.clearDoctor();
  }

  clearDoctor(): void {
    this.doctorName = '';
    this.doctor = undefined;
    this.clearDate();
  }

  clearDate(): void {
    this.day = undefined;
    this.clearTime();
  }

  clearTime(): void {
    this.selectedInterval = this.selectedTicket = -1;
    this.start = this.end = undefined;
    this.possibleEvents = [];
  }

  selectTime(i: number): void {
    this.selectedInterval = i;
    const t = this.day!.intervals![i]
    this.start = t.start;
    this.end = t.end;
  }

  isDisabled(): boolean {
    if (this.step === 0) {
      return !this.hasSelectedDoctor() && !this.hasSelectedRole();
    }
    if (this.step === 1) {
      return !this.start || ! this.end;
    }
    return !this.hasClientName() || !this.hasClientIdentity();
  }

  getPopUpClass(): string {
    return this.isOpened ? '' : 'collapsed';
  }

  back(): void {
    if (this.step > 0) {
      this.step--;
      this.cdr.markForCheck();
    }
  }

  hasSelectedRole(): boolean {
    return !!this.doctorRole?.length && this.doctorRole != ANY_ROLE;
  }

  hasSelectedDoctor(): boolean {
    return !!this.doctor?.id;
  }

  hasClientName(): boolean {
    return this.client.name?.length > 5 && this.client.name.trim().split(' ').length > 0;
  }

  hasClientIdentity(): boolean {
    return this.useEmail ? isMailValid(this.client.email) :
      this.client.primaryPhone.length > 8;
  }

  async next(): Promise<void> {
    if (this.step === 0) {
      if (this.hasSelectedRole() || this.hasSelectedDoctor()) {
        this.isLoadingStep = true;
        this.cdr.markForCheck();
        try {
          await this.loadDays();
          this.step++;
        } catch (e) {
          // TODO show toast
          alert('Не удалось загрузить дни');
        }
        this.isLoadingStep = false;
        this.cdr.markForCheck();
      }
    }
    else if (this.step === 1) {
      if (this.start && this.end) {
        this.step++;
        this.cdr.markForCheck();
      }
    }
  }

  handleMonthChange(data: {year: number; month: number}) {
    const now = new Date();
    const yearOffset = data.year - now.getFullYear();
    const monthOffset = data.month - now.getMonth();
    this.daysPage = monthOffset + yearOffset * 12;
    this.loadDays().catch();
  }
}
