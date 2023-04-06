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
import {getName, mobileWidth} from 'src/app/shared/utils';
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
    if (this.client.name.length < 2 || this.client.primaryPhone.length < 9) {
      // this.toast.show('Заполните информацию о клинете', 0);
      alert('Заполните информацию о себе');
      return;
    }
    this.isLoadingSave = true;
    try {
      const client = await ScheduleSdk.clients.save(this.client) as ClientDto | number;
      this.clientId = typeof client === 'number' ? client : client.id;
    } catch (e) {
      // this.toast.showError('Не удалось создать запись', e);
      alert('Не удалось создать запись');
    }
    this.isLoadingSave = false;
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

  buildTicketsForDoctors(day: FreeDay[]): void {
    if (day.length != 1) return;
    console.time('build tickets');

    this.possibleEvents = [];
    const doctors = (day[0].doctors || []);

    const combinations = ObjectUtils.groupBy(doctors, d => d.speciality);

    const intervalsCombinations = combinations.map(comb => {
      const allIntervals: Ticket[] = comb.reduce((accum, doctor) => {
          const { freeTime, ...d } = doctor;
          const doctorIntervals = freeTime.reduce((all, i) => {
              i.start = new Date(i.start);
              i.end = new Date(i.end);
              all.push(...TimeUtils.splitByPeriods(i, d.admissionMinutes || 30));
              return all;
            },
            [] as TimestampInterval[]
          );

          accum.push(...doctorIntervals.map(time => ({ doctor: d as DoctorMin, time })))
          return accum;
        },
        [] as Ticket[]
      );

      // sort events by end time as remove tickets which has intersections
      let possibleEvents: PossibleEvent[] = ObjectUtils.groupBy(allIntervals, i => i.doctor);
      possibleEvents.forEach(e => e.sort((t1, t2) => t1.time.end.getTime() - t2.time.end.getTime()));
      possibleEvents = possibleEvents.filter(e => !TimeUtils.hasIntersections(e.map(c => c.time)))

      // remove duplicates where only doctors order differs
      return this.selectedDoctors.length < 2 ? possibleEvents : ObjectUtils.dropDuplicatesBy(
        possibleEvents,
        e => {
          const startTime = e[0].time.start.getTime();
          const waitTime = TimeUtils.getWaitingTime(e.map(t => t.time));
          return startTime + ' ' + waitTime;
        }
      )
    });

    // merge all combinations
    this.possibleEvents = intervalsCombinations.length > 1 ?
      intervalsCombinations.reduce((acc, val) => [...acc, ...val], []) :
      intervalsCombinations[0];

    // sort by waiting time if there are more than 1 session
    // and by start time is waiting time is equal
    if (this.selectedDoctors.length > 1) {
      this.possibleEvents.sort((c1, c2) => {
          const waitingTime1 = TimeUtils.getWaitingTime(c1.map(t => t.time));
          const waitingTime2 = TimeUtils.getWaitingTime(c2.map(t => t.time));
          const diff = waitingTime1 - waitingTime2;
          return diff === 0 ? c1[0].time.start.getTime() - c2[0].time.start.getTime() : diff;
        }
      );
    }

    console.timeEnd('build tickets');
    console.log('\npossibleEvents: ', this.possibleEvents);
    this.day = day[0];
  }

  async loadDays(): Promise<void> {
    this.loadingDays = true;
    try {
      const intervals = await ScheduleSdk.doctors.getFreeDays(this.doctor!.id, this.daysPage);
      this.days = [];
      let lastDay = '', currentDay = '';
      intervals.forEach(i => {
        i.start = new Date(i.start);
        i.end = new Date(i.end);
        currentDay = DateUtils.toString(i.start) + ', ' + DateUtils.getWeekDay(i.start);
        if (currentDay !== lastDay) {
          lastDay = currentDay;
          this.days.push({ date: i.start, display: lastDay, intervals: [] });
        }
        this.days.at(-1)!.intervals!.push(
          ...TimeUtils.splitByPeriods(i, this.doctor?.admissionMinutes || 30)
        );
      });
      console.log('days: ', this.days);
    } catch (e) {
      // this.toast.showError("Не удалось зугрузить расписание", e);
      alert("Не удалось зугрузить расписание");
    }
    this.loadingDays = false;
  }

  handleDaySelect(day: FreeDay[]) {
    if (day.length != 1) {
      if (day.length > 1) {
        console.warn("error. days more than 1 in one day");
      }
      return;
    }
    this.day = day[0];
  }

  getStartString(t: TimestampInterval): string {
    return Time.fromDate(t.start).toString()
  }

  getIntervalString(t: TimestampInterval): string {
    return TimeInterval.fromTimestamp(t).toString();
  }

  getDateStyle(): string {
    return !!this.day ? 'height:200%;transform: translateY(-50%)' : 'height:200%';
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

  selectTicket(i: number) {
    this.selectedTicket = i;
    this.cdr.markForCheck();
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
    const hasClient = this.client.name && this.client.primaryPhone &&
      this.client.name.length > 1 && this.client.primaryPhone.length > 8;

    return !hasClient;
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
}