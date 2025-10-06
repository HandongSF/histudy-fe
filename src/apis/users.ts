import axios from 'axios';
import { AuthResponse } from 'src/interface/token';
import { TeamMember, User } from 'src/interface/user';
import axiosInstance from '../utils/axiosInstance';
import { BACKEND_BASE_URL } from '@/const/endpoints';

type SignUpRequest = Pick<User, 'email' | 'name' | 'sid'> & {
   sub: string;
};

interface SearchFriendResponse {
   users: User[];
}

export const userLogin = async (sub: string): Promise<AuthResponse> => {
   const response = await axios.get(`${BACKEND_BASE_URL}/api/auth/login?sub=${sub}`);
   return response.data;
};

export const userSignup = async (data: SignUpRequest): Promise<AuthResponse> => {
   const response = await axios.post(`${BACKEND_BASE_URL}/api/users`, data);
   return response.data;
};

export const searchUser = async (search: string): Promise<SearchFriendResponse> => {
   const response = await axiosInstance.get(`/api/v2/users?search=${search}`);
   return response.data;
};

export const getMyTeamUsers = async (): Promise<TeamMember[]> => {
   const response = await axiosInstance.get(`/api/team/users`);
   return response.data;
};

export const getProfile = async (): Promise<User> => {
   const response = await axiosInstance.get(`/api/users/me`);
   return response.data;
};
