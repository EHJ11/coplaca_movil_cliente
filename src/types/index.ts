// User & Auth
export interface AddressDTO {
  street: string;
  streetNumber: string;
  apartment?: string;
  city: string;
  postalCode: string;
  province: string;
  additionalInfo?: string;
  latitude?: number;
  longitude?: number;
}

export interface UserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: AddressDTO;
  warehouseName?: string;
}

export interface LoginResponse {
  token: string;
  type?: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}

// Products
export interface ProductDTO {
  id: number;
  name: string;
  description?: string;
  unit: string;
  unitPrice: number;
  originalPrice?: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId?: number;
  categoryName?: string;
  origin?: string;
  nutritionInfo?: string;
  offerReason?: string;
  discountPercentage?: number;
}

// Cart
export interface CartItem {
  productId: number;
  name: string;
  unitPrice: number;
  stockQuantity: number;
  quantityKg: number;
  imageUrl?: string;
  offerReason?: string;
}

// Orders
export interface OrderItemDTO {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDTO {
  id: number;
  userId?: number;
  status?: string;
  totalAmount?: number;
  orderItems?: OrderItemDTO[];
  createdAt?: string;
}

// Filters
export interface ProductFilters {
  searchQuery: string;
  category: string;
  onlyInStock: boolean;
  onlyOffers: boolean;
  onlyFresh: boolean;
}

// Offer
export interface OfferInfo {
  reason: string;
  discountPercentage: number;
}
