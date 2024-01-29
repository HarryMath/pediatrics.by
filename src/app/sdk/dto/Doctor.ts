import { CreateUserFE } from 'src/app/sdk/dto/User';
import { TimestampInterval } from './Interval';

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

export type DoctorRole = string;

export interface DoctorDto extends CreateUserFE {
  id: number;
  description?: string;
  birthday?: Date; // defined
  experience: Experience[];
  education: Education[];
  services: Service[];
  speciality?: DoctorRole[];
  category: string; // defined
  admissionMinutes?: number;
  userId: number;

  nextAvailable?: Date | null;
}

export interface DoctorMin {
  id: number,
  avatar?: string,
  name: string,
  speciality?: DoctorRole[],
  admissionMinutes?: number
}

export interface Day {
  date: Date;
  options: TimestampInterval[]
}


