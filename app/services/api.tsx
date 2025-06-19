import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'

const checkStatus = (response: AxiosResponse): AxiosResponse => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText) as Error & { response?: AxiosResponse };
  error.response = response;
  throw error;
};

const returnData = (response: AxiosResponse) => (response.data || {});

const axiosErrorHandler = (error: AxiosError) => {
  if (error.response) {
    const statusCode = error.response.status;
    return error.response.data;
  }
  if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Axios error', error.message);
  }
  return {
    error: 'unknownAxiosError',
  };
};

const performPost = (url: string, data: any, config = {}) => (
  axios.post(url, data, config)
    .then(checkStatus)
    .then(returnData)
    .catch(axiosErrorHandler)
);

const performGet = (
  url: string,
  getParams: Record<string, any> = {},
  config: AxiosRequestConfig = {}
) => {
  config.params = getParams;
  return axios.get(url, config)
    .then(checkStatus)
    .then(returnData)
    .catch(axiosErrorHandler);
};

type userData = {
  email: string,
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  profilePicture: string | null,
}

export const registerUser = async (userData: userData) => {
  return performPost('/api/user/register', userData);
};

export const loginUser = async (email: string, password: string) => {
  const credentials = {
    'email': email,
    'password': password,
  }
  return performPost('/api/user/login', credentials);
};
