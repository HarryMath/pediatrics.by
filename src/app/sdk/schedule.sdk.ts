import { DoctorDto } from 'src/app/sdk/dto/Doctor';
import { ClientCreateDto, ClientDto } from './dto/Client';
import { EventCreateDto } from './dto/Event';
import { TimestampInterval } from './dto/Interval';

// const endpoint = 'http://localhost:8080/api/';
const endpoint = 'https://timekit.online/api/';
const widget = 'http://localhost:4200/public/1';
const LAST_VISIT_KEY = 'vld';
const VISIT_TRACK_LIMIT = 3 * 60 * 60 * 1000; // 3 h

export const headers = {
  "Content-Type": "application/json",
};

export class ScheduleSdk {

  static doctors = {
    async get(search?: string): Promise<DoctorDto[]> {
      const d = await ScheduleSdk.get<DoctorDto[]>('doctors', { search });
      return d.filter(d => d.id !== 9);
    },

    getRoles(): Promise<string[]> {
      return ScheduleSdk.get<string[]>('doctors/roles');
    },

    async getFreeDays(id: number, monthIndex: number): Promise<TimestampInterval[]> {
      // days.forEach(d => {
      //   d.start = DateUtils.setTimeZone(d.start, 3);
      //   d.end = DateUtils.setTimeZone(d.end, 3);
      // });
      return await ScheduleSdk.get<TimestampInterval[]>(`doctors/${ id }/free-time/${ monthIndex }`);
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

  static visits = {
    async track(isMobile: boolean, isAdmissionClick = false): Promise<void> {
      try {
        const lastVisitDateString = localStorage.getItem(LAST_VISIT_KEY);
        if (lastVisitDateString) {
          const lastVisitDate = new Date(lastVisitDateString);
          if (new Date().getTime() - lastVisitDate.getTime() < VISIT_TRACK_LIMIT) {
            return;
          }
        }
        const { date }  = await ScheduleSdk.post<{ date: string }>('visits', { isMobile, isAdmissionClick });
        localStorage.setItem(LAST_VISIT_KEY, date || new Date().toISOString());
      } catch (ignore) {
        console.clear();
      }
    }
  }

  static async get<Res = void>(path: string, query?: Record<string, any>): Promise<Res> {
    const queryString = ScheduleSdk.buildQueryString(query);

    let finalUrl = endpoint + path;
    if (queryString) {
      finalUrl += '?' + queryString;
    }
    const response = await fetch(finalUrl, { method: 'GET' });
    return await response.json();
  }

  private static buildQueryString(query?: Record<string, any>): string {
    return Object
      .entries(query || {})
      .filter(([, value]) => value !== undefined && value !== null && value?.length !== 0)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
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

  static getWidgetUrl(doctorId?: number) {
    const origin = document.location.origin;
    const query = ScheduleSdk.buildQueryString({ doctorId, origin });
    return widget + '?' + query;
  }
}
