import { DoctorMin } from 'src/app/sdk/dto/Doctor';
import { TimestampInterval } from 'src/app/sdk/dto/Interval';

export interface WorkdayDto extends TimestampInterval {
  id: number,
  date: Date,
  breaks: TimestampInterval[];
  doctorId: number;
  closed?: boolean;
}

export interface DeleteWorkDay {
  id: number,
  dayId: number,
}

export interface AvailableDoctor extends DoctorMin {
  freeTime: TimestampInterval[];
}

export interface AvailableDay {
  date: Date|string;
  doctors: AvailableDoctor[];
}
