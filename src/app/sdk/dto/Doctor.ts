import { CreateUserFE } from 'src/app/sdk/dto/User';
import { EventExtendedDto } from 'src/app/sdk/dto/Event';
import { TimestampInterval } from 'src/app/sdk/dto/Interval';

export interface Service {
  id: number;
  name: string;
  price: number;
}

export interface Experience {
  place: string;
  start: number;
  end: number;
  role: string;
  isPresent: boolean;
}

export interface Education {
  place: string;
  start: number;
  speciality: string;
  end: number;
  isPresent?: boolean
}

export type DoctorSchedule = [
  DoctorDaySchedule,
  DoctorDaySchedule,
  DoctorDaySchedule,
  DoctorDaySchedule,
  DoctorDaySchedule,
  DoctorDaySchedule,
  DoctorDaySchedule
];

export interface DoctorDaySchedule extends TimestampInterval {
  isWorkDay: boolean;
  breaks: TimestampInterval[];
}

export type DoctorRole = string;

export interface DoctorDto extends CreateUserFE {
  id: number;
  description?: string;
  birthday?: Date; // defined
  experience: Experience[];
  education: Education[];
  services: Service[];
  speciality?: DoctorRole;
  category: string; // defined
  admissionMinutes?: number;
  userId: number;
}

export interface CreateDoctorFE extends Omit<DoctorDto, 'id'|'userId'> {}

export interface UpdateDoctorFE extends Partial<CreateDoctorFE> {
  id: number;
}

export interface DoctorMin {
  id: number,
  avatar?: string,
  name: string,
  speciality?: string,
  admissionMinutes?: number
}

export interface DoctorColumnDto {
  id: number;
  name: string;
  avatar?: string;
  start: Date;
  end: Date;
  speciality: string;
  admissionMinutes?: number;
  events: EventExtendedDto[];
  breaks: TimestampInterval[];
  freePeriods: TimestampInterval[];
}

export const defaultDoctor = (): DoctorDto => ({
  id: 0,
  userId: 0,
  category: '',
  education: [],
  experience: [],
  email: '',
  fatherName: '',
  firstName: '',
  lastName: '',
  services: [],
  type: 'doctor',
});
