import client from './axiosClient.js';

export const list    = (params = {}) => client.get('/cases',               { params });
export const summary = ()            => client.get('/cases/stats/summary');
export const getById = (id)          => client.get(`/cases/${id}`);
export const create  = (data)        => client.post('/cases', data);
export const update  = (id, data)    => client.patch(`/cases/${id}`, data);
export const assign  = (id, userId)  => client.patch(`/cases/${id}/assign`, { assignedTo: userId });
export const flag    = (id, reason, remarks) => client.post(`/cases/${id}/flag`, { reason, remarks });
export const unflag  = (id)          => client.delete(`/cases/${id}/flag`);
export const fullHistory = ()        => client.get('/cases/history/full');