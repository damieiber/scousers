export const commonSources = [
  { id: 'lpm', name: 'La Página Millonaria' },
  { id: 'tyc', name: 'TyCSports' },
  { id: 'ole', name: 'Olé' },
  { id: 'espn', name: 'ESPN' },
  { id: 'bolavip', name: 'Bolavip' },
  { id: 'clarin', name: 'Clarín' },
  { id: 'lanacion', name: 'La Nación' },
  { id: 'infobae', name: 'Infobae' },
  { id: 'canchallena', name: 'Cancha Llena' },
  { id: 'liverpoolfc', name: 'Liverpool FC Official' },
];

export function getSourceById(id: string) {
  return commonSources.find(source => source.id === id);
}
