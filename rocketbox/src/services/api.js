import axios from 'axios';
import BaseUrl from '../../credentials/baseUrl';

const api = axios.create({ baseURL: BaseUrl.ip });

export default api;