// src/api/axios.js

import axios from 'axios';

// 🔧 Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // replace with your actual backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//
// ✅ GATE PASS APIs
//

// GET: View all gate passes
export const viewGatePass = async () => {
  try {
    const response = await axiosInstance.get('/gatepass');
    return response.data;
  } catch (error) {
    console.error('Error viewing gate passes:', error);
    throw error;
  }
};

// POST: Add a new gate pass
export const addGatePass = async (gatePassData) => {
  try {
    const response = await axiosInstance.post('/gatepass', gatePassData);
    return response.data;
  } catch (error) {
    console.error('Error adding gate pass:', error);
    throw error;
  }
};

//
// ✅ (Optional) USER APIs Example
//

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
