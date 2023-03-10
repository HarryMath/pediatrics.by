export interface ID {
  id: number;
}

export interface ClientDto {
  id: number;
  name: string;
  birthDate?: Date; // ask if it is needed
  primaryPhone: string;
  phones: string[];
  email?: string;
  members: Person[];
}

export interface Person {
  name?: string;
  phone?: string;
  birthDate?: Date;
}

export interface ClientCreateDto extends Omit<ClientDto, 'id'> {}

export interface ClientUpdateDto extends Partial<ClientCreateDto> {
  id: number;
}
