const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[1-9]\d{7,14}$/;

const SERVICE_MAP: Record<string, string> = {
  ride: "ride",
  rides: "ride",
  delivery: "delivery",
  deliveries: "delivery",
  rental: "rental",
  rentals: "rental",
  school_shuttle: "school_shuttle",
  schoolshuttle: "school_shuttle",
  "school shuttle": "school_shuttle",
  "school shuttles": "school_shuttle",
  tour: "tour",
  tours: "tour",
  ems: "ambulance",
  ambulance: "ambulance",
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/\D/g, "")}`;
  }
  return trimmed.replace(/\D/g, "");
}

function assertValidEmail(email: string): void {
  if (!EMAIL_RE.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
}

function assertValidPhone(phone: string): void {
  if (!PHONE_RE.test(phone)) {
    throw new Error("Please enter a valid phone number.");
  }
}

function assertPassword(password: string): string {
  const next = password.trim();
  if (next.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  return next;
}

function normalizeServices(services?: string[]): string[] {
  const normalized = (services || [])
    .map((service) => SERVICE_MAP[service.trim().toLowerCase()] || "")
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

export function normalizeFleetLoginInput(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  if (!email || !password) {
    throw new Error("Please enter both email and password.");
  }
  assertValidEmail(email);
  return { email, password };
}

export function normalizeFleetRegistrationInput(input: {
  companyName: string;
  email: string;
  phone?: string;
  registrationNumber?: string;
  taxId?: string;
  fleetSize?: string;
  services?: string[];
  metadata?: Record<string, unknown>;
  password: string;
}) {
  const companyName = input.companyName.trim();
  if (companyName.length < 2) {
    throw new Error("Company name is required.");
  }

  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone || "");
  const fleetSize = input.fleetSize?.trim() || "";
  const services = normalizeServices(input.services);
  const password = assertPassword(input.password);

  assertValidEmail(email);
  assertValidPhone(phone);

  if (!fleetSize) {
    throw new Error("Fleet size is required.");
  }
  if (services.length === 0) {
    throw new Error("Select at least one service.");
  }

  return {
    companyName,
    email,
    phone,
    registrationNumber: input.registrationNumber?.trim() || undefined,
    taxId: input.taxId?.trim() || undefined,
    fleetSize,
    services,
    metadata: input.metadata && typeof input.metadata === "object" ? input.metadata : {},
    password,
  };
}

export function normalizeFleetProfileInput(input: {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
}) {
  const companyName = input.companyName.trim();
  const contactEmail = normalizeEmail(input.contactEmail);
  const contactPhone = normalizePhone(input.contactPhone);

  if (companyName.length < 2) {
    throw new Error("Company name is required.");
  }
  assertValidEmail(contactEmail);
  assertValidPhone(contactPhone);

  return {
    companyName,
    contactEmail,
    contactPhone,
  };
}
