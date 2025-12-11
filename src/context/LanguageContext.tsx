import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define supported languages
export type Language = "en" | "fr" | "es" | "sw" | "ar" | "zh";

export interface LanguageOption {
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
}

export const LANGUAGES: LanguageOption[] = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
    { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
];

// Translation keys type
interface Translations {
    // Auth
    login: string;
    email: string;
    password: string;
    forgotPassword: string;
    rememberMe: string;
    signIn: string;
    welcomeBack: string;
    loginSubtitle: string;
    // Navigation
    dashboard: string;
    liveMap: string;
    manualDispatch: string;
    trips: string;
    rentals: string;
    drivers: string;
    vehicles: string;
    earnings: string;
    settings: string;
    help: string;
    // Common
    search: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    loading: string;
    noResults: string;
    selectLanguage: string;
    // Dashboard
    dashboardOverview: string;
    vehiclesOnline: string;
    activeDrivers: string;
    tripsToday: string;
    netRevenue: string;
}

// All translations
const translations: Record<Language, Translations> = {
    en: {
        login: "Login",
        email: "Email address",
        password: "Password",
        forgotPassword: "Forgot password?",
        rememberMe: "Remember me",
        signIn: "Sign in",
        welcomeBack: "Welcome back",
        loginSubtitle: "Sign in to your Fleet Partner account",
        dashboard: "Dashboard",
        liveMap: "Live fleet map",
        manualDispatch: "Manual dispatch",
        trips: "Trips & deliveries",
        rentals: "Car rental",
        drivers: "Drivers",
        vehicles: "Vehicles",
        earnings: "Earnings",
        settings: "Settings",
        help: "Help & Support",
        search: "Search...",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        loading: "Loading...",
        noResults: "No results found",
        selectLanguage: "Select language",
        dashboardOverview: "Dashboard Overview",
        vehiclesOnline: "Vehicles online",
        activeDrivers: "Active drivers",
        tripsToday: "Trips today",
        netRevenue: "Net revenue",
    },
    fr: {
        login: "Connexion",
        email: "Adresse e-mail",
        password: "Mot de passe",
        forgotPassword: "Mot de passe oublié?",
        rememberMe: "Se souvenir de moi",
        signIn: "Se connecter",
        welcomeBack: "Bienvenue",
        loginSubtitle: "Connectez-vous à votre compte Fleet Partner",
        dashboard: "Tableau de bord",
        liveMap: "Carte en direct",
        manualDispatch: "Dispatch manuel",
        trips: "Trajets et livraisons",
        rentals: "Location de voiture",
        drivers: "Chauffeurs",
        vehicles: "Véhicules",
        earnings: "Revenus",
        settings: "Paramètres",
        help: "Aide et support",
        search: "Rechercher...",
        save: "Enregistrer",
        cancel: "Annuler",
        delete: "Supprimer",
        edit: "Modifier",
        add: "Ajouter",
        loading: "Chargement...",
        noResults: "Aucun résultat trouvé",
        selectLanguage: "Choisir la langue",
        dashboardOverview: "Aperçu du tableau de bord",
        vehiclesOnline: "Véhicules en ligne",
        activeDrivers: "Chauffeurs actifs",
        tripsToday: "Trajets aujourd'hui",
        netRevenue: "Revenu net",
    },
    es: {
        login: "Iniciar sesión",
        email: "Correo electrónico",
        password: "Contraseña",
        forgotPassword: "¿Olvidaste tu contraseña?",
        rememberMe: "Recordarme",
        signIn: "Ingresar",
        welcomeBack: "Bienvenido de nuevo",
        loginSubtitle: "Inicia sesión en tu cuenta de Fleet Partner",
        dashboard: "Panel de control",
        liveMap: "Mapa en vivo",
        manualDispatch: "Despacho manual",
        trips: "Viajes y entregas",
        rentals: "Alquiler de autos",
        drivers: "Conductores",
        vehicles: "Vehículos",
        earnings: "Ganancias",
        settings: "Configuración",
        help: "Ayuda y soporte",
        search: "Buscar...",
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar",
        loading: "Cargando...",
        noResults: "No se encontraron resultados",
        selectLanguage: "Seleccionar idioma",
        dashboardOverview: "Resumen del panel",
        vehiclesOnline: "Vehículos en línea",
        activeDrivers: "Conductores activos",
        tripsToday: "Viajes hoy",
        netRevenue: "Ingresos netos",
    },
    sw: {
        login: "Ingia",
        email: "Barua pepe",
        password: "Nenosiri",
        forgotPassword: "Umesahau nenosiri?",
        rememberMe: "Nikumbuke",
        signIn: "Ingia",
        welcomeBack: "Karibu tena",
        loginSubtitle: "Ingia kwenye akaunti yako ya Fleet Partner",
        dashboard: "Dashibodi",
        liveMap: "Ramani ya moja kwa moja",
        manualDispatch: "Kutuma kwa mkono",
        trips: "Safari na utoaji",
        rentals: "Kukodisha gari",
        drivers: "Madereva",
        vehicles: "Magari",
        earnings: "Mapato",
        settings: "Mipangilio",
        help: "Msaada",
        search: "Tafuta...",
        save: "Hifadhi",
        cancel: "Ghairi",
        delete: "Futa",
        edit: "Hariri",
        add: "Ongeza",
        loading: "Inapakia...",
        noResults: "Hakuna matokeo",
        selectLanguage: "Chagua lugha",
        dashboardOverview: "Muhtasari wa Dashibodi",
        vehiclesOnline: "Magari mtandaoni",
        activeDrivers: "Madereva wanaofanya kazi",
        tripsToday: "Safari za leo",
        netRevenue: "Mapato halisi",
    },
    ar: {
        login: "تسجيل الدخول",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        forgotPassword: "نسيت كلمة المرور؟",
        rememberMe: "تذكرني",
        signIn: "دخول",
        welcomeBack: "مرحباً بعودتك",
        loginSubtitle: "سجل الدخول إلى حسابك في Fleet Partner",
        dashboard: "لوحة التحكم",
        liveMap: "الخريطة المباشرة",
        manualDispatch: "الإرسال اليدوي",
        trips: "الرحلات والتوصيل",
        rentals: "تأجير السيارات",
        drivers: "السائقون",
        vehicles: "المركبات",
        earnings: "الأرباح",
        settings: "الإعدادات",
        help: "المساعدة والدعم",
        search: "بحث...",
        save: "حفظ",
        cancel: "إلغاء",
        delete: "حذف",
        edit: "تعديل",
        add: "إضافة",
        loading: "جاري التحميل...",
        noResults: "لا توجد نتائج",
        selectLanguage: "اختر اللغة",
        dashboardOverview: "نظرة عامة على لوحة التحكم",
        vehiclesOnline: "المركبات المتصلة",
        activeDrivers: "السائقون النشطون",
        tripsToday: "رحلات اليوم",
        netRevenue: "صافي الإيرادات",
    },
    zh: {
        login: "登录",
        email: "电子邮件",
        password: "密码",
        forgotPassword: "忘记密码？",
        rememberMe: "记住我",
        signIn: "登录",
        welcomeBack: "欢迎回来",
        loginSubtitle: "登录您的Fleet Partner账户",
        dashboard: "仪表板",
        liveMap: "实时地图",
        manualDispatch: "手动调度",
        trips: "行程和配送",
        rentals: "汽车租赁",
        drivers: "司机",
        vehicles: "车辆",
        earnings: "收入",
        settings: "设置",
        help: "帮助与支持",
        search: "搜索...",
        save: "保存",
        cancel: "取消",
        delete: "删除",
        edit: "编辑",
        add: "添加",
        loading: "加载中...",
        noResults: "未找到结果",
        selectLanguage: "选择语言",
        dashboardOverview: "仪表板概览",
        vehiclesOnline: "在线车辆",
        activeDrivers: "活跃司机",
        tripsToday: "今日行程",
        netRevenue: "净收入",
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translations) => string;
    languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>(() => {
        const stored = localStorage.getItem("app_language");
        return (stored as Language) || "en";
    });

    useEffect(() => {
        localStorage.setItem("app_language", language);
        // Set document direction for RTL languages
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: keyof Translations): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
