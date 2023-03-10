import { DoctorDto } from 'src/app/sdk/dto/Doctor';

export const endpoint = 'http://localhost:80/api/'

export class ScheduleSdk {
  static async getDoctors(): Promise<DoctorDto> {
    const response = await fetch(endpoint + 'doctors');
    return await response.json();
  }
}
