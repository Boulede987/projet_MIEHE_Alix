export * from './components/pollution-navbar/pollution-navbar';
export * from './services/pollution-api';
export * from './classes/submittedPollution/submitted-pollution';
export * from './components/list-pollutions/list-pollutions';
export * from './components/pollution-recap/pollution-recap';
export * from './components/form-delcaration-pollution/form-delcaration-pollution';

// un "Barrel", au lieu de ngModule
// on export les components, services, classes, etc qu'on veux donner à disposition dans ce fichier.
// on pourrais en faire une librairie plus tard, pour distribuer facilement