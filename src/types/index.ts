/**
 * Shared Common & Domain Types
 */

export interface PaginationData {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "CONSULTANT" | "ADMIN" | string;
  status: string;
  activeStatus?: boolean;
  createdAt: string;
  image?: string;
  avatar?: string;
  phoneNumber?: string;
  stats?: {
    avgRating: number;
    totalReviews: number;
  };
}

export interface Transaction {
  _id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  createdAt: string;
  user: { name: string } | null;
  consultant: { name: string } | null;
  consultation: { duration: number } | null;
  actualDuration?: number;
  billedDuration?: number;
}
