import { ClientDto } from 'src/app/sdk/dto/Client';
import { DoctorDto } from 'src/app/sdk/dto/Doctor';

export interface EventDto {
  id: number;
  start: Date;
  end: Date;
  isSubmitted?: boolean;
  isVisited?: boolean;
  isCanceled?: boolean;
  clientId: number;
  doctorId: number;
  createdAt?: Date;
}

export interface EventCreateDto extends Omit<EventDto, 'id'>{}

export interface EventUpdateDto extends Partial<EventDto> {
  id: number;
}

export interface EventExtendedDto extends EventDto {
  doctorId: number;
  client: ClientDto;
}

export interface EventListDto extends EventDto {
  client: ClientDto,
  doctor: DoctorDto,
}

export interface EventAggregatedDto {
  client: ClientDto,
  events: (EventDto & { doctor: DoctorDto })[],

  isRemoved?: true
}
