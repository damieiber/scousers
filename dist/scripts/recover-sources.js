import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is not set in .env.local');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const sourcesToRecover = [
    { name: 'Infobae - River Plate', url: 'https://www.infobae.com/deportes/futbol/river-plate/' },
    { name: 'TN - River Plate', url: 'https://tn.com.ar/tags/river-plate/' },
    { name: 'Clarín - River Plate', url: 'https://www.clarin.com/tema/river-plate.html' },
    { name: 'La Nación - River Plate', url: 'https://www.lanacion.com.ar/deportes/futbol/river-plate/' },
    { name: 'Mdzol - River Plate', url: 'https://www.mdzol.com/temas/river-plate-16.html' },
    { name: 'La Pagina Millonaria - River Plate', url: 'https://lapaginamillonaria.com/' },
    { name: 'Olé - River Plate', url: 'https://www.ole.com.ar/river-plate' },
];
const TEAM_KEY = 'River Plate';
async function main() {
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('key', TEAM_KEY)
        .single();
    if (teamError || !team) {
        console.error(`Error: Could not find team with key '${TEAM_KEY}'. Please ensure the team exists.`);
        if (teamError)
            console.error(teamError);
        return;
    }
    const teamId = team.id;
    const sourcesWithTeamId = sourcesToRecover.map(source => ({ ...source, team_id: teamId }));
    const { data, error: upsertError } = await supabase
        .from('sources')
        .upsert(sourcesWithTeamId, { onConflict: 'url' });
    if (upsertError) {
        console.error('❌ An error occurred while recovering sources:');
        console.error(upsertError);
    }
}
main().catch(console.error);
