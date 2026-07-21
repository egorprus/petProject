import { CalendarEventType } from "./enums";

export type AuthProviderValue = {
  token: string;
  onLogin: (token: string) => void;
  onLogout: () => void;
};

export type AuthContextType = AuthProviderValue;

/** Type navigation item */
export type NavItem = {
  name: string;
  path: string;
};

/** Interface user data */
export interface UserData {
  _id: string;
  fullName: string;
  login: string;
  createdAt: string;
  updatedAt: string;
  token: string;
  __v: number;
}

export interface LoginData {
  login: string;
  password: string;
}

export interface RegistrationData {
  login: string;
  password: string;
  fullName: string;
}

export interface BankFormData {
  _id?: string;
  date: string;
  expected: string;
  received: string;
  rate?: number;
}

export interface CalendarEventFormData {
  _id?: string;
  startDate: string;
  endDate: string;
  description: string;
  type: CalendarEventType;
  isRecurring: boolean;
}

export type SubmitType = (data: LoginData) => void;

export interface ButtonProps {
  classList?: string;
  size?: string;
}

export type NavigationEntity = {
  id: number;
  link: string;
  icon: string;
  text: string;
};

export type PostUser = {
  _id: string;
  fullName: string;
  login: string;
};

export type PostItem = {
  _id: string;
  title: string;
  text: string;
  user: PostUser;
  viewsCount: number;
  status?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AlbumEntity = {
  id: number;
  image: string;
  name: string;
  executor: string;
  tracks: number;
  likes: number;
};

export type TrackEntity = {
  id: number;
  name: string;
  image: string;
  executor: string;
  album: string;
  year: number;
  duration: string;
};

export type MonthType = {
	label: string,
	value: number
};