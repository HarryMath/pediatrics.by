import { TimeInterval } from '../utils/TimeInterval';
import { ClientDto, Person } from '../dto/Client';

export const fakeColors = () => ({ bgColor: '', textColor: '', shadowColor: '', borderColor: '', headerColor: '' });

export const fakePerson = (name: string): Person => ({
  name, phone: '+375 (25) 768-58-98'
});

export const fakeClient = (name: string = 'Курдяшина Малина'): ClientDto => ({
  email: 'kudrmalina@gmail.com', phones: [], id: 0, name, primaryPhone: '+375 (25) 768-58-98',
  members: [fakePerson('Abobus')]
})

export const fakeInterval = () => TimeInterval.fromTimestamp({start: new Date(), end: new Date()});

export const fakeDate = (h: number, m: number) => new Date(2022, 9, 27, h, m, 0, 0);

export const fakeDoctor = (id: number, name: string, start: Date, end: Date, breaks: any[]) => ({
  id, name, avatar: '',
  speciality: '',
  start, end, breaks, ...fakeColors(),
  events: [],
  freePeriods: [],
});

export const fakeEvent = (doctor: number, start: Date, end: Date, isSubmitted = false, isVisited = false) => ({
  id: 3, doctorId: doctor,
  clientId: 0,
  client: fakeClient(),
  start, end, isCanceled: false,
  isSubmitted, isVisited,
  interval: fakeInterval(),
  style: {top: '0', left: '0', width: '0', height: '0'}
});

export const fakeDoctors = () => ([
  fakeDoctor(1, 'Наталья Дубатовка',
    fakeDate(9, 0), fakeDate(16, 30),
    [{
      start: new Date(2022, 9, 27, 11, 0, 0, 0),
      end: new Date(2022, 9, 27, 11, 30, 0, 0)
    }, {
      start: new Date(2022, 9, 27, 15, 30, 0, 0),
      end: new Date(2022, 9, 27, 16, 0, 0, 0)
    }]),
  fakeDoctor(2, 'Галя Ируксис',
    fakeDate(11, 0), fakeDate(16, 30),
    [{
      start: new Date(2022, 9, 27, 12, 0, 0, 0),
      end: new Date(2022, 9, 27, 12, 30, 0, 0)
    }]),
  fakeDoctor(3, 'Вадим Балдин',
    fakeDate(11, 0), fakeDate(16, 30),
    [{
      start: new Date(2022, 9, 27, 12, 0, 0, 0),
      end: new Date(2022, 9, 27, 12, 30, 0, 0)
    }]),
  fakeDoctor(4, 'Ирина Кушмиш',
    fakeDate(13, 0), fakeDate(16, 50), []
  ),
]);

export const fakeEvents = () => ([
  fakeEvent(1, fakeDate(11, 45), fakeDate(13, 40)),
  fakeEvent(1, fakeDate(13, 45), fakeDate(16, 15)),
  fakeEvent(2, fakeDate(11, 45), fakeDate(13, 40)),
  fakeEvent(3, fakeDate(9, 0), fakeDate(10, 0)),
  fakeEvent(4, fakeDate(15, 45), fakeDate(16, 40)),
]);

export const fakeDays = () => ([
  { name: 'Пн', doctors: fakeDoctors(), label: ''},
  { name: 'Вт', doctors: fakeDoctors(), label: ''},
  { name: 'Ср', doctors: fakeDoctors(), label: ''},
  { name: 'Чт', doctors: fakeDoctors(), label: ''},
  { name: 'Пт', doctors: fakeDoctors(), label: ''},
  { name: 'Сб', doctors: fakeDoctors(), label: ''},
  { name: 'Вс', doctors: fakeDoctors(), label: ''}
])

export const fakeWorkday = (doctorId: number) => ({
  id: 0,
  doctorId,
  date: undefined as any as Date,
  start: undefined as any as Date,
  end: undefined as any as Date,
  breaks: []
})
