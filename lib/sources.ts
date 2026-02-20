export const commonSources = [
  { id: 'liverpoolfc', name: 'Liverpool FC Official' },
  { id: 'liverpoolecho', name: 'Liverpool Echo' },
  { id: 'thisisanfield', name: 'This Is Anfield' },
  { id: 'empireofthekop', name: 'Empire of the Kop' },
  { id: 'anfieldwatch', name: 'Anfield Watch' },
  { id: 'rousingthekop', name: 'Rousing The Kop' },
  { id: 'evertonfc', name: 'Everton FC Official' },
  { id: 'liverpoolecho-everton', name: 'Liverpool Echo (Everton)' },
  { id: 'toffeeweb', name: 'ToffeeWeb' },
  { id: 'grandoldteam', name: 'GrandOldTeam' },
  { id: 'royalbluemersey', name: 'Royal Blue Mersey' },
  { id: 'goodisonnews', name: 'Goodison News' },
];

export function getSourceById(id: string) {
  return commonSources.find(source => source.id === id);
}
