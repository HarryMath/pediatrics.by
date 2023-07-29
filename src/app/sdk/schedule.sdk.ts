import { DoctorDto } from 'src/app/sdk/dto/Doctor';
import {ClientCreateDto, ClientDto} from "./dto/Client";
import {EventCreateDto} from "./dto/Event";
import {TimestampInterval} from "./dto/Interval";

export const endpoint = 'http://localhost:8080/api/';
// export const endpoint = 'https://timekit.online/api/';
export const headers = {
  "Content-Type": "application/json",
};

export class ScheduleSdk {

  static doctors = {
    get(search?: string): Promise<DoctorDto[]> {
      return ScheduleSdk.get<DoctorDto[]>('doctors', { search });
    },

    getRoles(): Promise<string[]> {
      return ScheduleSdk.get<string[]>('doctors/roles');
    },

    async getFreeDays(id: number, monthIndex: number): Promise<TimestampInterval[]> {
      const days = await ScheduleSdk.get<TimestampInterval[]>(`doctors/${id}/free-time/${monthIndex}`);
      // days.forEach(d => {
      //   d.start = DateUtils.setTimeZone(d.start, 3);
      //   d.end = DateUtils.setTimeZone(d.end, 3);
      // });
      return days;
    },

    async getNextAvailable(id: number): Promise<Date|undefined> {
      const next = await ScheduleSdk.get<{ time: Date }|undefined>(`doctors/${id}/next-available`);
      return next?.time ? new Date(next.time) : undefined;
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
    const response = await fetch(endpoint + path, { method: 'POST', body, headers });
    const result = await response.json();
    if (!response.ok) {
      console.log('error: ', result);
      throw new Error(result)
    }
    return result;
  }
}
