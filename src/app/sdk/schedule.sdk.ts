import { DoctorDto } from 'src/app/sdk/dto/Doctor';
import {ClientCreateDto, ClientDto} from "./dto/Client";
import {EventCreateDto} from "./dto/Event";
import {TimestampInterval} from "./dto/Interval";

export const endpoint = 'http://localhost:80/api/'

export class ScheduleSdk {

  static doctors = {
    get(search?: string): Promise<DoctorDto[]> {
      return ScheduleSdk.get<DoctorDto[]>('doctors', { search });
    },

    getRoles(): Promise<string[]> {
      return ScheduleSdk.get<string[]>('doctors/roles');
    },

    getFreeDays(id: number, monthIndex: number): Promise<TimestampInterval[]> {
      return ScheduleSdk.get<TimestampInterval[]>(`doctors/${id}/free-time/${monthIndex}`);
    }
  }

  static clients = {
    save(c: ClientCreateDto): Promise<ClientDto> {
      return ScheduleSdk.post<ClientDto, ClientCreateDto>('clients', c);
    }
  }

  static events = {
    create(e: EventCreateDto): Promise<void> {
      return ScheduleSdk.post<void, EventCreateDto>('events', e);
    }
  }

  static async get<Res = void>(path: string, query?: Record<string, any>): Promise<Res> {
    const queryString = Object
      .entries(query || {})
      .filter(([key, value]) => value !== undefined && value !== null && value?.length !== 0)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    let finalUrl = endpoint + path;
    if (queryString) {
      finalUrl += '?' + queryString;
    }
    const response = await fetch(finalUrl, { method: 'GET' });
    return await response.json();
  }

  static async post<Res = void, Req extends {} = {}>(path: string, payload?: Req): Promise<Res> {
    const body = JSON.stringify(payload || {});
    const response = await fetch(endpoint + path, { method: 'POST', body });
    return await response.json();
  }
}
