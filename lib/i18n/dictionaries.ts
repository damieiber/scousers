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
  // Auth form
  authForm: {
    email: string;
    emailPlaceholder: string;
    password: string;
    invalidEmail: string;
    passwordMinLength: string;
    loginButton: string;
    registerButton: string;
    loginSuccess: string;
    registerSuccess: string;
    genericError: string;
    googleError: string;
    registerError: string;
    orContinueWith: string;
    noAccount: string;
    hasAccount: string;
  };
  // Team selector
  teamSelector: {
    selectTeam: string;
    searchTeam: string;
    noTeamFound: string;
    available: string;
    comingSoon: string;
    noTeam: string;
  };
  // Auth gate
  authGate: {
    title: string;
    description: string;
    signIn: string;
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
  // Standings
  standings: {
    title: string;
    subtitle: string;
    team: string;
    played: string;
    won: string;
    drawn: string;
    lost: string;
    points: string;
    form: string;
  };
  // Match Center
  matchCenter: {
    title: string;
    subtitle: string;
    nextMatch: string;
    home: string;
    away: string;
    dateTime: string;
    venue: string;
    referee: string;
    weather: string;
    league: string;
    tacticalBoard: string;
    avgPossession: string;
    attackZones: string;
    shotsPerMatch: string;
    total: string;
    onTarget: string;
    setPieces: string;
    corners: string;
    freeKicks: string;
    forLabel: string;
    against: string;
    goalsFrom: string;
    concededFrom: string;
    improving: string;
    declining: string;
    stable: string;
    riskIndex: string;
    riskLevel: string;
    low: string;
    medium: string;
    high: string;
    keyFactors: string;
    riskDisclaimer: string;
    history: string;
    wins: string;
    draws: string;
    goals: string;
    oddsTitle: string;
    oddsDisclaimer: string;
    draw: string;
    resultWin: string;
    resultDraw: string;
    resultLoss: string;
  };
  // Squad
  squad: {
    title: string;
    subtitle: string;
    formMeter: string;
    rating: string;
    squadLoad: string;
    defenders: string;
    midfielders: string;
    forwards: string;
    optimal: string;
    caution: string;
    overload: string;
    transferMarket: string;
    from: string;
    to: string;
    impact: string;
    impactHigh: string;
    impactMedium: string;
    impactLow: string;
    loanWatch: string;
    at: string;
    matches: string;
    goalsLabel: string;
    assists: string;
    youthProspect: string;
    prospectOfWeek: string;
    standoutPerformance: string;
    comingSoon: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
  };
  // Features teaser
  featuresTeaser: {
    title: string;
    subtitle: string;
    matchCenterDesc: string;
    squadDesc: string;
    standingsDesc: string;
    efemeridesDesc: string;
    cta: string;
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
  authForm: {
    email: 'Email',
    emailPlaceholder: 'nombre@ejemplo.com',
    password: 'Contraseña',
    invalidEmail: 'Email inválido',
    passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
    loginButton: 'Iniciar Sesión',
    registerButton: 'Registrarse',
    loginSuccess: 'Sesión iniciada correctamente',
    registerSuccess: 'Cuenta creada y sesión iniciada',
    genericError: 'Ocurrió un error. Por favor intenta de nuevo.',
    googleError: 'Error al conectar con Google',
    registerError: 'Error al registrarse',
    orContinueWith: 'O continuar con',
    noAccount: '¿No tienes cuenta? Regístrate',
    hasAccount: '¿Ya tienes cuenta? Inicia sesión',
  },
  teamSelector: {
    selectTeam: 'Seleccioná un equipo...',
    searchTeam: 'Buscar equipo...',
    noTeamFound: 'No se encontró el equipo.',
    available: 'Disponibles',
    comingSoon: 'Próximamente',
    noTeam: 'Sin equipo',
  },
  authGate: {
    title: 'Acceso Restringido',
    description: 'Necesitás iniciar sesión para acceder a esta sección.',
    signIn: 'Iniciar Sesión',
  },
  ephemeridesCard: {
    today: 'HOY',
  },
  footer: {
    description: 'Tu fuente número uno de noticias, estadísticas e historia. Hecho por hinchas, para hinchas.',
    allRightsReserved: 'Todos los derechos reservados.',
  },
  standings: {
    title: 'Tablas de Posiciones',
    subtitle: 'Seguimiento de todas las competencias oficiales.',
    team: 'Equipo',
    played: 'PJ',
    won: 'G',
    drawn: 'E',
    lost: 'P',
    points: 'Pts',
    form: 'Forma',
  },
  matchCenter: {
    title: 'Match Center',
    subtitle: 'Análisis táctico y previa del próximo partido.',
    nextMatch: 'Próximo Partido',
    home: 'Local',
    away: 'Visitante',
    dateTime: 'Fecha y Hora',
    venue: 'Estadio',
    referee: 'Árbitro',
    weather: 'Clima',
    league: 'Premier League',
    tacticalBoard: 'Tablero Táctico',
    avgPossession: 'Posesión Media',
    attackZones: 'Zonas de Ataque',
    shotsPerMatch: 'Tiros por partido',
    total: 'Total',
    onTarget: 'Al Arco',
    setPieces: 'Balón Parado',
    corners: 'Córners',
    freeKicks: 'Tiros Libres',
    forLabel: 'A Favor',
    against: 'En Contra',
    goalsFrom: 'Goles de',
    concededFrom: 'Recibidos de',
    improving: 'Mejorando',
    declining: 'Empeorando',
    stable: 'Estable',
    riskIndex: 'Índice de Riesgo',
    riskLevel: 'Nivel de Riesgo',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    keyFactors: 'Factores Clave',
    riskDisclaimer: '* Cálculo basado en forma reciente, bajas y mercado.',
    history: 'Historial',
    wins: 'Victorias',
    draws: 'Empates',
    goals: 'Goles',
    oddsTitle: 'Quién Paga Más',
    oddsDisclaimer: '⚠️ Informativo. Las cuotas pueden variar. Jugar compulsivamente es perjudicial para la salud.',
    draw: 'Empate',
    resultWin: 'Victoria',
    resultDraw: 'Empate',
    resultLoss: 'Derrota',
  },
  squad: {
    title: 'Plantel Profesional',
    subtitle: 'Gestión de rendimiento, cargas y mercado de pases.',
    formMeter: 'Formómetro (Top 5)',
    rating: 'Rating',
    squadLoad: 'Mapa de Carga',
    defenders: 'Defensores',
    midfielders: 'Mediocampistas',
    forwards: 'Delanteros',
    optimal: 'Óptimo',
    caution: 'Precaución',
    overload: 'Sobrecarga',
    transferMarket: 'Mercado de Pases',
    from: 'Desde',
    to: 'Hacia',
    impact: 'Impacto',
    impactHigh: 'Alto',
    impactMedium: 'Medio',
    impactLow: 'Bajo',
    loanWatch: 'Loan Watch',
    at: 'En',
    matches: 'PJ',
    goalsLabel: 'Goles',
    assists: 'Asist.',
    youthProspect: 'Semillero',
    prospectOfWeek: 'Prospecto de la Semana',
    standoutPerformance: 'Actuación Destacada',
    comingSoon: 'Próximamente: Estadísticas Históricas',
  },
  common: {
    loading: 'Cargando...',
    error: 'Error',
  },
  featuresTeaser: {
    title: 'Lo que te estás perdiendo...',
    subtitle: 'Creá tu cuenta gratis y elegí tu equipo para desbloquear la experiencia completa de un club.',
    matchCenterDesc: 'Tácticas, datos en vivo, previas detalladas del partido y el histórico cara a cara del próximo encuentro.',
    squadDesc: 'El formómetro, mapas de carga de los jugadores, mercado de pases local y seguimiento de los pibes.',
    standingsDesc: 'Seguí a tu equipo en la Premier League y en Copas. Siempre sabrás dónde estás parado.',
    efemeridesDesc: 'Un viaje diario por la historia de tu equipo. Goles memorables, cumpleaños y campeonatos.',
    cta: 'Ingresar Gratis',
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
  authForm: {
    email: 'Email',
    emailPlaceholder: 'name@example.com',
    password: 'Password',
    invalidEmail: 'Invalid email',
    passwordMinLength: 'Password must be at least 6 characters',
    loginButton: 'Sign In',
    registerButton: 'Sign Up',
    loginSuccess: 'Signed in successfully',
    registerSuccess: 'Account created and signed in',
    genericError: 'An error occurred. Please try again.',
    googleError: 'Error connecting to Google',
    registerError: 'Error signing up',
    orContinueWith: 'Or continue with',
    noAccount: "Don't have an account? Sign up",
    hasAccount: 'Already have an account? Sign in',
  },
  teamSelector: {
    selectTeam: 'Select a team...',
    searchTeam: 'Search team...',
    noTeamFound: 'No team found.',
    available: 'Available',
    comingSoon: 'Coming Soon',
    noTeam: 'No team',
  },
  authGate: {
    title: 'Restricted Access',
    description: 'You need to sign in to access this section.',
    signIn: 'Sign In',
  },
  ephemeridesCard: {
    today: 'TODAY',
  },
  footer: {
    description: 'Your number one source for news, stats, and history. Made by fans, for fans.',
    allRightsReserved: 'All rights reserved.',
  },
  standings: {
    title: 'Standings',
    subtitle: 'Track all official competitions.',
    team: 'Team',
    played: 'P',
    won: 'W',
    drawn: 'D',
    lost: 'L',
    points: 'Pts',
    form: 'Form',
  },
  matchCenter: {
    title: 'Match Center',
    subtitle: 'Tactical analysis and next match preview.',
    nextMatch: 'Next Match',
    home: 'Home',
    away: 'Away',
    dateTime: 'Date & Time',
    venue: 'Venue',
    referee: 'Referee',
    weather: 'Weather',
    league: 'Premier League',
    tacticalBoard: 'Tactical Board',
    avgPossession: 'Avg. Possession',
    attackZones: 'Attack Zones',
    shotsPerMatch: 'Shots per match',
    total: 'Total',
    onTarget: 'On Target',
    setPieces: 'Set Pieces',
    corners: 'Corners',
    freeKicks: 'Free Kicks',
    forLabel: 'For',
    against: 'Against',
    goalsFrom: 'Goals from',
    concededFrom: 'Conceded from',
    improving: 'Improving',
    declining: 'Declining',
    stable: 'Stable',
    riskIndex: 'Risk Index',
    riskLevel: 'Risk Level',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    keyFactors: 'Key Factors',
    riskDisclaimer: '* Based on recent form, injuries, and market data.',
    history: 'History',
    wins: 'Wins',
    draws: 'Draws',
    goals: 'Goals',
    oddsTitle: 'Best Odds',
    oddsDisclaimer: '⚠️ Informational only. Odds may vary. Please gamble responsibly.',
    draw: 'Draw',
    resultWin: 'Win',
    resultDraw: 'Draw',
    resultLoss: 'Loss',
  },
  squad: {
    title: 'First Team Squad',
    subtitle: 'Performance management, workload, and transfer market.',
    formMeter: 'Form Meter (Top 5)',
    rating: 'Rating',
    squadLoad: 'Squad Load Map',
    defenders: 'Defenders',
    midfielders: 'Midfielders',
    forwards: 'Forwards',
    optimal: 'Optimal',
    caution: 'Caution',
    overload: 'Overload',
    transferMarket: 'Transfer Market',
    from: 'From',
    to: 'To',
    impact: 'Impact',
    impactHigh: 'High',
    impactMedium: 'Medium',
    impactLow: 'Low',
    loanWatch: 'Loan Watch',
    at: 'At',
    matches: 'MP',
    goalsLabel: 'Goals',
    assists: 'Ast.',
    youthProspect: 'Youth Academy',
    prospectOfWeek: 'Prospect of the Week',
    standoutPerformance: 'Standout Performance',
    comingSoon: 'Coming Soon: Historical Stats',
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
  },
  featuresTeaser: {
    title: 'What you\'re missing out on...',
    subtitle: 'Create your free account and choose your team to unlock the full club experience.',
    matchCenterDesc: 'Tactics, live data, detailed match previews and historical head-to-head for the upcoming fixture.',
    squadDesc: 'The form meter, player load maps, transfer market updates, and youth academy tracking.',
    standingsDesc: 'Follow your team in the Premier League and Cups. Always know where you stand.',
    efemeridesDesc: 'A daily journey through your team\'s history. Memorable goals, birthdays, and championships.',
    cta: 'Sign In for Free',
  },
};

export const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.es;
}
