import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';

class CustomerApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, firstName: string, lastName: string, phoneNumber: string, address: any) {
    return this.client.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
    });
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    const { token } = response.data.data;
    await AsyncStorage.setItem('authToken', token);
    return response.data;
  }

  async logout() {
    await AsyncStorage.removeItem('authToken');
  }

  // Landing page endpoints
  async getLandingPage() {
    return this.client.get('/landing');
  }

  async getSeasonalProducts() {
    return this.client.get('/landing/seasonal');
  }

  async getRecommendations() {
    return this.client.get('/landing/recommendations');
  }

  // Product endpoints
  async getAllProducts(page = 0, size = 20) {
    return this.client.get('/products', { params: { page, size } });
  }

  async getProductsByCategory(categoryId: number) {
    return this.client.get(`/products/category/${categoryId}`);
  }

  async searchProducts(keyword: string) {
    return this.client.get('/products/search', { params: { keyword } });
  }

  async getProductDetails(productId: number) {
    return this.client.get(`/products/${productId}`);
  }

  // Category endpoints
  async getCategories() {
    return this.client.get('/categories');
  }

  // Order endpoints
  async createOrder(items: Array<{ productId: number; quantity: number }>, shippingAddressId: number) {
    return this.client.post('/orders', {
      items,
      shippingAddressId,
    });
  }

  async getMyOrders(status?: string) {
    return this.client.get('/orders', { params: { status } });
  }

  async getOrderDetails(orderId: number) {
    return this.client.get(`/orders/${orderId}`);
  }

  async cancelOrder(orderId: number, reason?: string) {
    return this.client.put(`/orders/${orderId}/cancel`, { reason });
  }

  // ETA endpoints
  async getOrderETA(orderId: number) {
    return this.client.get(`/orders/eta/${orderId}`);
  }

  // User endpoints
  async getCurrentUser() {
    return this.client.get('/users/me');
  }

  async updateProfile(data: any) {
    return this.client.put('/users/profile', data);
  }

  async getAddresses() {
    return this.client.get('/users/addresses');
  }

  async addAddress(address: any) {
    return this.client.post('/users/addresses', address);
  }

  async updateAddress(addressId: number, address: any) {
    return this.client.put(`/users/addresses/${addressId}`, address);
  }

  async deleteAddress(addressId: number) {
    return this.client.delete(`/users/addresses/${addressId}`);
  }
}

export default new CustomerApiClient();
