"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonSources = void 0;
exports.getSourceById = getSourceById;
exports.commonSources = [
    { id: 'lpm', name: 'La Página Millonaria' },
    { id: 'tyc', name: 'TyCSports' },
    { id: 'ole', name: 'Olé' },
    { id: 'espn', name: 'ESPN' },
    { id: 'bolavip', name: 'Bolavip' },
    { id: 'clarin', name: 'Clarín' },
    { id: 'lanacion', name: 'La Nación' },
    { id: 'infobae', name: 'Infobae' },
    { id: 'canchallena', name: 'Cancha Llena' },
    { id: 'riverplateoficial', name: 'River Plate Oficial' },
];
function getSourceById(id) {
    return exports.commonSources.find(source => source.id === id);
}
