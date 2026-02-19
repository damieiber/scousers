export type Locale = 'es' | 'en';

export interface Dictionary {
  // Nav
  nav: {
    home: string;
    feed: string;
    matchCenter: string;
    squad: string;
    standings: string;
    efemerides: string;
    club: string;
    rival: string;
  };
  // Home page
  home: {
    featuredArticle: string;
    latestNews: string;
    ephemerides: string;
    specialCoverage: string;
    multipleSources: string;
    unknownSource: string;
    viewMoreNews: string;
    couldNotLoadFeed: string;
  };
  // Feed page
  feed: {
    title: string;
    rivalTitle: string;
    subtitle: string;
    rivalSubtitle: string;
    rivalMode: string;
    noRivalNews: string;
    noNews: string;
    noRivalNewsDesc: string;
    noNewsDesc: string;
  };
  // News card
  newsCard: {
    readMore: string;
    sources: string;
    badForThem: string;
    neutral: string;
    goodForThem: string;
  };
  // News detail
  newsDetail: {
    backToHome: string;
    originalSources: string;
    readArticle: string;
  };
  // Profile
  profile: {
    personalData: string;
    basicInfo: string;
    email: string;
    emailCantChange: string;
    fullName: string;
    fullNamePlaceholder: string;
    subscriptionPlan: string;
    subscriptionDesc: string;
    currentPlan: string;
    expiresOn: string;
    upgradeMessage: string;
    activeFeatures: string;
    favoriteTeams: string;
    favoriteTeamsDesc: string;
    primaryTeam: string;
    selectTeam: string;
    noTeamSelected: string;
    secondaryTeams: string;
    secondaryTeamsDesc: string;
    saveChanges: string;
    language: string;
    languageDesc: string;
    languageLabel: string;
  };
  // Subscription labels
  subscriptions: {
    free: string;
    standard: string;
    plus: string;
    premium: string;
    trial: string;
  };
  // Auth
  auth: {
    login: string;
    logout: string;
    profile: string;
    myTeams: string;
    settings: string;
  };
  // Ephemerides card
  ephemeridesCard: {
    today: string;
  };
  // Footer
  footer: {
    description: string;
    allRightsReserved: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
  };
}

const es: Dictionary = {
  nav: {
    home: 'Inicio',
    feed: 'Feed',
    matchCenter: 'Match Center',
    squad: 'Plantel',
    standings: 'Tablas',
    efemerides: 'Efemérides',
    club: 'Club',
    rival: 'Rival',
  },
  home: {
    featuredArticle: 'Noticia Destacada',
    latestNews: 'Últimas Noticias',
    ephemerides: 'Efemérides',
    specialCoverage: 'Cobertura Especial',
    multipleSources: 'Varias fuentes',
    unknownSource: 'Fuente desconocida',
    viewMoreNews: 'Ver más noticias',
    couldNotLoadFeed: 'No se pudo cargar el feed.',
  },
  feed: {
    title: 'Feed de Noticias',
    rivalTitle: 'Noticias de Rivales',
    subtitle: 'Todas las noticias de tu equipo en un solo lugar',
    rivalSubtitle: 'Lo que está pasando con tus rivales - ordenado por impacto',
    rivalMode: 'Modo Rival',
    noRivalNews: '🏟️ No hay noticias de rivales aún',
    noNews: 'Aún no hay noticias.',
    noRivalNewsDesc: 'Los rivales se configuran automáticamente. La IA está trabajando.',
    noNewsDesc: 'Vuelve a intentarlo en unos minutos, la IA está trabajando.',
  },
  newsCard: {
    readMore: 'Leer más',
    sources: '+Fuentes',
    badForThem: 'Mala para ellos',
    neutral: 'Neutral',
    goodForThem: 'Buena para ellos',
  },
  newsDetail: {
    backToHome: 'Volver al Inicio',
    originalSources: 'Fuentes Originales',
    readArticle: 'Leer nota →',
  },
  profile: {
    personalData: 'Datos Personales',
    basicInfo: 'Información básica de tu cuenta',
    email: 'Email',
    emailCantChange: 'El email no se puede cambiar directamente',
    fullName: 'Nombre Completo',
    fullNamePlaceholder: 'Tu nombre',
    subscriptionPlan: 'Plan de Suscripción',
    subscriptionDesc: 'Tu plan actual y características disponibles',
    currentPlan: 'Plan Actual',
    expiresOn: 'Expira el',
    upgradeMessage: '💡 Mejorá tu experiencia: Actualizá a un plan Premium para desbloquear características exclusivas como modo rival, personalización visual y más.',
    activeFeatures: 'Características Activas',
    favoriteTeams: 'Equipos Favoritos',
    favoriteTeamsDesc: 'Seleccioná tu equipo principal para personalizar tu feed de noticias',
    primaryTeam: 'Equipo Principal',
    selectTeam: 'Seleccioná tu equipo (opcional)',
    noTeamSelected: 'Si no seleccionás un equipo, verás noticias de todos los equipos disponibles',
    secondaryTeams: 'Equipos Secundarios',
    secondaryTeamsDesc: 'En los planes Premium podrás seguir múltiples equipos',
    saveChanges: 'Guardar Cambios',
    language: 'Idioma',
    languageDesc: 'Seleccioná tu idioma preferido para la plataforma',
    languageLabel: 'Idioma de la plataforma',
  },
  subscriptions: {
    free: 'Gratuito',
    standard: 'Standard',
    plus: 'Plus',
    premium: 'Premium',
    trial: 'Prueba',
  },
  auth: {
    login: 'Ingresar',
    logout: 'Cerrar Sesión',
    profile: 'Perfil',
    myTeams: 'Mis Equipos (Premium)',
    settings: 'Configuración',
  },
  ephemeridesCard: {
    today: 'HOY',
  },
  footer: {
    description: 'Tu fuente número uno de noticias, estadísticas e historia del Más Grande. Hecho por hinchas, para hinchas.',
    allRightsReserved: 'Todos los derechos reservados.',
  },
  common: {
    loading: 'Cargando...',
    error: 'Error',
  },
};

const en: Dictionary = {
  nav: {
    home: 'Home',
    feed: 'Feed',
    matchCenter: 'Match Center',
    squad: 'Squad',
    standings: 'Standings',
    efemerides: 'On This Day',
    club: 'Club',
    rival: 'Rival',
  },
  home: {
    featuredArticle: 'Featured Article',
    latestNews: 'Latest News',
    ephemerides: 'On This Day',
    specialCoverage: 'Special Coverage',
    multipleSources: 'Multiple sources',
    unknownSource: 'Unknown source',
    viewMoreNews: 'View more news',
    couldNotLoadFeed: 'Could not load feed.',
  },
  feed: {
    title: 'News Feed',
    rivalTitle: 'Rival News',
    subtitle: 'All your team news in one place',
    rivalSubtitle: "What's happening with your rivals - sorted by impact",
    rivalMode: 'Rival Mode',
    noRivalNews: '🏟️ No rival news yet',
    noNews: 'No news yet.',
    noRivalNewsDesc: 'Rivals are configured automatically. The AI is working.',
    noNewsDesc: 'Try again in a few minutes, the AI is working.',
  },
  newsCard: {
    readMore: 'Read more',
    sources: '+Sources',
    badForThem: 'Bad for them',
    neutral: 'Neutral',
    goodForThem: 'Good for them',
  },
  newsDetail: {
    backToHome: 'Back to Home',
    originalSources: 'Original Sources',
    readArticle: 'Read article →',
  },
  profile: {
    personalData: 'Personal Data',
    basicInfo: 'Basic account information',
    email: 'Email',
    emailCantChange: 'Email cannot be changed directly',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Your name',
    subscriptionPlan: 'Subscription Plan',
    subscriptionDesc: 'Your current plan and available features',
    currentPlan: 'Current Plan',
    expiresOn: 'Expires on',
    upgradeMessage: '💡 Upgrade your experience: Switch to a Premium plan to unlock exclusive features like rival mode, visual customization, and more.',
    activeFeatures: 'Active Features',
    favoriteTeams: 'Favorite Teams',
    favoriteTeamsDesc: 'Select your main team to personalize your news feed',
    primaryTeam: 'Primary Team',
    selectTeam: 'Select your team (optional)',
    noTeamSelected: "If you don't select a team, you'll see news from all available teams",
    secondaryTeams: 'Secondary Teams',
    secondaryTeamsDesc: 'Premium plans allow you to follow multiple teams',
    saveChanges: 'Save Changes',
    language: 'Language',
    languageDesc: 'Select your preferred language for the platform',
    languageLabel: 'Platform language',
  },
  subscriptions: {
    free: 'Free',
    standard: 'Standard',
    plus: 'Plus',
    premium: 'Premium',
    trial: 'Trial',
  },
  auth: {
    login: 'Sign In',
    logout: 'Sign Out',
    profile: 'Profile',
    myTeams: 'My Teams (Premium)',
    settings: 'Settings',
  },
  ephemeridesCard: {
    today: 'TODAY',
  },
  footer: {
    description: 'Your number one source for news, stats, and history of the greatest club. Made by fans, for fans.',
    allRightsReserved: 'All rights reserved.',
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
  },
};

export const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.es;
}
