// Driver types
export interface Driver {
    id: number | string;
    name: string;
    phone?: string;
    email?: string;
    status: 'available' | 'on-trip' | 'offline' | 'suspended';
    trips?: number;
    rating?: number;
    earnings?: string;
    license?: string;
    expiry?: string;
    address?: string;
}

// Vehicle types
export interface Vehicle {
    id: number | string;
    plate: string;
    model: string;
    year?: string;
    color?: string;
    vin?: string;
    type?: string;
    status: 'available' | 'offline' | 'maintenance' | 'out-of-service';
    driver?: string;
    mileage?: number;
}

// Trip types
export interface Trip {
    id: number | string;
    tripId?: string;
    pickup: string;
    dropoff: string;
    driver?: string;
    vehicle?: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    fare?: number | string;
    date?: string;
}

// Payout types
export interface Payout {
    id: string;
    name: string;
    amount: string;
    status: 'pending' | 'processing' | 'completed';
    date: string;
    trips: number;
}

// Support message types
export interface SupportMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    status: 'sent' | 'pending' | 'resolved';
}

// Incident types
export interface Incident {
    id: number;
    incidentId: string;
    type: string;
    vehicle: string;
    driver: string;
    date: string;
    severity: 'minor' | 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'investigating' | 'resolved';
    description?: string;
}

// Route types
export interface ShuttleRoute {
    id: number;
    name: string;
    vehicle: string;
    students: number;
    status: 'active' | 'scheduled' | 'inactive';
    stops?: RouteStop[];
}

export interface RouteStop {
    id: number;
    name: string;
    time: string;
    days: string[];
}

// Student types
export interface Student {
    id: number;
    name: string;
    school: string;
    grade: string;
    parent: string;
    phone: string;
    routeId?: number;
}

// Tour types
export interface Tour {
    id: number;
    name: string;
    vehicle: string;
    status: 'active' | 'scheduled' | 'completed' | 'cancelled';
    bookings: number;
    capacity: number;
}

// Rental types
export interface Rental {
    id: number;
    bookingId?: string;
    customerName: string;
    vehicleName?: string;
    vehiclePlate: string;
    status: 'active' | 'upcoming' | 'completed' | 'cancelled';
    startDate: string;
    endDate: string;
}

// Branch types
export interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    manager: string;
    email: string;
    isActive: boolean;
}

// Session types
export interface Session {
    id: number;
    device: string;
    browser: string;
    location: string;
    ip: string;
    lastActive: string;
    isCurrent: boolean;
    icon: string;
}

// Integration types
export interface Integration {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'payments' | 'telematics' | 'accounting' | 'communication';
    status: 'connected' | 'disconnected';
    provider: string | null;
    connectedAt: string | null;
}

// Role types
export interface Role {
    id: number;
    name: string;
    description: string;
    color: string;
    isSystem: boolean;
    permissions: RolePermissions;
}

export interface RolePermissions {
    dashboard: boolean;
    vehicles: ResourcePermission;
    drivers: ResourcePermission;
    trips: ResourcePermission;
    earnings: EarningsPermission;
    settings: SettingsPermission;
    reports: ReportsPermission;
}

export interface ResourcePermission {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

export interface EarningsPermission {
    view: boolean;
    export: boolean;
    manage: boolean;
}

export interface SettingsPermission {
    view: boolean;
    edit: boolean;
}

export interface ReportsPermission {
    view: boolean;
    export: boolean;
}

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Common props
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
}
