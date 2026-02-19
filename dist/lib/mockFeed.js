import { sanitizeHtml } from '@/lib/sanitize';
function iso(minutesAgo) {
    return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}
export function buildMockFeed() {
    const news1 = {
        id: 'news-1',
        type: 'news',
        teamKey: 'river-plate',
        createdAt: iso(8),
        title: 'La joya de la Reserva que sube al primer equipo',
        aiSummary: sanitizeHtml('El mediocampista ofensivo deslumbró en inferiores y podría sumar minutos en el próximo amistoso.'),
        source: { id: 'lpm', name: 'La Página Millonaria' },
        publishedAt: iso(120),
        originalUrl: 'https://lapaginamillonaria.com/noticia',
    };
    const best = {
        id: 'news-2',
        type: 'news',
        teamKey: 'river-plate',
        createdAt: iso(6),
        title: 'River acelera por un zaguero europeo de jerarquía',
        aiSummary: sanitizeHtml('La dirigencia negocia contra reloj para cerrar al defensor central en las próximas 48 horas.'),
        source: { id: 'tyc', name: 'TyCSports' },
        publishedAt: iso(10),
        originalUrl: 'https://tycsports.com/noticia',
    };
    const group = {
        id: 'group-1',
        type: 'news_group',
        teamKey: 'river-plate',
        createdAt: iso(7),
        title: best.title,
        aiSummary: best.aiSummary,
        featuredArticleId: best.id,
        totalSources: 5,
        articles: [
            best,
            {
                ...best,
                id: 'news-3',
                source: { id: 'ole', name: 'Olé' },
                createdAt: iso(9),
                publishedAt: iso(12),
                originalUrl: 'https://ole.com.ar/noticia',
            },
        ],
    };
    const eph = {
        id: 'eph-1',
        type: 'ephemeris',
        teamKey: 'river-plate',
        createdAt: iso(60),
        title: 'Un día como hoy: La Libertadores 1996',
        shortSummary: sanitizeHtml('River levantó la Copa Libertadores tras vencer a América de Cali.'),
        detail: sanitizeHtml('Contexto histórico, datos curiosos y formaciones del equipo campeón. Contenido enriquecido por IA.'),
    };
    const photo = {
        id: 'photo-1',
        type: 'photo_of_day',
        teamKey: 'river-plate',
        createdAt: iso(30),
        imageUrl: '/window.svg',
        caption: 'La foto del día de River Plate',
        originalPostUrl: 'https://instagram.com/riverplate/post/xyz',
    };
    return [eph, group, news1, photo].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
export function findNewsOrGroupById(id) {
    const items = buildMockFeed();
    return items.find((it) => it.id === id && (it.type === 'news' || it.type === 'news_group'));
}
export function findEphemerisById(id) {
    const items = buildMockFeed();
    return items.find((it) => it.id === id && it.type === 'ephemeris');
}
