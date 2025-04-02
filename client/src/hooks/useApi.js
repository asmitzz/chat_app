import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useApi = () => {
  const [data, setData] = useState(null);       
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);    
  const navigate = useNavigate();

  const request = async (method, url, body = null) => {
    // const storedUser = JSON.parse(localStorage.getItem('user'));
    setLoading(true);
    setError(null);
    setData(null)
    try {
      const response = await axios({
        method,  
        url,
        data: body, 
        withCredentials: true,
        // headers:  {
        //   Authorization: `Bearer ${storedUser?.token}`,
        // },
      });
      setData(response.data);
    } catch (err) {
      if(err?.status === 403 || err?.status === 401){
        navigate('/login');
      }
      setError(err?.response?.data || err?.message || 'An error occurred');
    } finally {
      setLoading(false); 
    }
  };

  const get = (url) => request('GET', url);
  const post = (url, body) => request('POST', url, body);
  const put = (url, body) => request('PUT', url, body);
  const del = (url) => request('DELETE', url);

  return { data, loading, error, get, post, put, del };
};

