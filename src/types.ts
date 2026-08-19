export type Language = 'te' | 'en';

export type UserRole = 'customer' | 'vendor' | 'admin';

export type ServiceType = 
  | 'all'
  | 'full_catering'
  | 'gents_staff'
  | 'ladies_staff'
  | 'combined_staff'
  | 'cooks_only'
  | 'cleaning';

export type EventType = 
  | 'wedding'
  | 'birthday'
  | 'engagement'
  | 'house_warming'
  | 'corporate'
  | 'small_party'
  | 'reception';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  city?: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  nameEn: string;
  nameTe: string;
  category: 'starter' | 'main_veg' | 'main_nonveg' | 'rice_biryani' | 'breads' | 'sweets_dessert' | 'live_counters' | 'drinks';
  priceExtra?: number; // extra cost per plate if special item
  isVeg: boolean;
  isPopular?: boolean;
}

export interface CateringStaffProfile {
  id: string;
  name: string;
  role: string;
  roleTe: string;
  gender: 'gents' | 'ladies';
  experienceYears: number;
  rating: number;
  specialty: string;
  specialtyTe: string;
  uniformColor: string;
  dailyRate: number;
  photoUrl: string;
  isAvailable: boolean;
}

export interface VendorService {
  serviceId: string;
  vendorId: string;
  vendorName: string;
  vendorNameTe?: string;
  serviceType: 'full_catering' | 'gents_staff' | 'ladies_staff' | 'combined_staff' | 'cooks_only' | 'cleaning';
  title: string;
  titleTe: string;
  description: string;
  descriptionTe: string;
  city: string;
  cityTe?: string;
  rating: number;
  reviewsCount: number;
  pricePerPlate: number; // For food catering
  pricePerStaffDay: number; // For staff hire
  gentsStaffAvailable: number;
  ladiesStaffAvailable: number;
  isVerified: boolean;
  phone: string;
  whatsapp: string;
  specialties: string;
  specialtiesTe: string;
  imageUrl: string;
  cateringTypes: ('veg' | 'nonveg' | 'south_indian' | 'north_indian' | 'hyderabadi' | 'sweets')[];
  minGuests?: number;
  maxGuests?: number;
  createdAt: string;
}

export interface Booking {
  bookingId: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceTitle: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  guestCount: number;
  gentsStaffCount: number;
  ladiesStaffCount: number;
  selectedMenu: string[];
  selectedMenuObjects?: MenuItem[];
  specialInstructions?: string;
  totalAmount: number;
  advancePaid: number;
  status: BookingStatus;
  paymentStatus: 'unpaid' | 'advance_paid' | 'fully_paid';
  assignedGentsLead?: string;
  assignedLadiesLead?: string;
  createdAt: string;
}

export interface Review {
  reviewId: string;
  serviceId: string;
  bookingId?: string;
  userId: string;
  userName: string;
  rating: number;
  foodRating?: number;
  staffRating?: number;
  comment: string;
  commentTe?: string;
  eventType?: string;
  eventDate?: string;
  createdAt: string;
}

export interface QuotationDetails {
  eventType: EventType;
  eventDate: string;
  eventTime: string;
  location: string;
  guestCount: number;
  gentsServers: number;
  gentsCooks: number;
  gentsHelpers: number;
  gentsCleaning: number;
  ladiesServers: number;
  ladiesHelpers: number;
  ladiesHospitality: number;
  ladiesCleaning: number;
  selectedItems: MenuItem[];
  perPlateBase: number;
  foodCost: number;
  staffCost: number;
  setupCost: number;
  subtotal: number;
  discount: number;
  total: number;
  advanceAmount: number;
}
