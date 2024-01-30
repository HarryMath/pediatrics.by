import { DoctorDto } from 'src/app/sdk/dto/Doctor';
import { ClientCreateDto, ClientDto } from './dto/Client';
import { EventCreateDto } from './dto/Event';
import { TimestampInterval } from './dto/Interval';

// const endpoint = 'http://localhost:8080/api/';
const endpoint = 'https://timekit.online/api/';
// const widget = 'http://localhost:4200/public/1';
const widget = 'https://timekit.by/public/1';
const LAST_VISIT_KEY = 'vld';
const VISIT_TRACK_LIMIT = 3 * 60 * 60 * 1000; // 3 h

const DOC_QUERY = "doctorId";
const START_QUERY = "eventStart";

export const headers = {
  "Content-Type": "application/json",
};

export class ScheduleSdk {

  static doctors = {
    async get(search?: string): Promise<DoctorDto[]> {
      const d = await ScheduleSdk.get<DoctorDto[]>('doctors', { search });
      return d.filter(d => d.id !== 9);
    },

    async getDayTickets(doctorId: number, day: Date | string): Promise<TimestampInterval[]> {
      const date = typeof day === 'string' ? day : day.toISOString();
      return ScheduleSdk.get<TimestampInterval[]>(`doctors/${doctorId}/tickets`, { date });
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
      throw new Error(result)
    }
    return result;
  }

  static getWidgetUrl(doctorId?: number, eventStart?: number) {
    const origin = document.location.origin;
    const params = { origin } as any;
    doctorId && (params[DOC_QUERY] = doctorId);
    eventStart && (params[START_QUERY] = eventStart);
    const query = ScheduleSdk.buildQueryString({ doctorId, origin, eventStart });
    return widget + '?' + query;
  }
}
