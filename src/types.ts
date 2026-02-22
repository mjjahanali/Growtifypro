export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Variation {
  id: number;
  product_id: number;
  name: string;
  price: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  image_url: string;
  base_price: number;
  is_variable: boolean;
  faq?: string;
  created_at: string;
  variations?: Variation[];
  reviews?: Review[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  variation?: Variation;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
}
