export type UserType = 'admin'|'super-admin'|'doctor';

export interface UserDto {
  id: number,
  firstName: string,
  lastName: string,
  fatherName: string,
  phone?: string,
  email: string,
  avatar?: string,
  type: UserType,
}

export interface CreateUserFE extends Omit<UserDto, 'id'> {}

