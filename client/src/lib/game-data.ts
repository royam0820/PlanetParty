import { WasteItem, QuizQuestion, TrueFalseQuestion } from "@/types/game";

export const wasteItems: WasteItem[] = [
  { id: '1', name: 'Bouteille plastique', emoji: '🥤', type: 'plastic' },
  { id: '2', name: 'Bouteille en verre', emoji: '🍷', type: 'glass' },
  { id: '3', name: 'Épluchure banane', emoji: '🍌', type: 'organic' },
  { id: '4', name: 'Papier journal', emoji: '📄', type: 'paper' },
  { id: '5', name: 'Boîte de conserve', emoji: '🥫', type: 'metal' },
  { id: '6', name: 'Carotte', emoji: '🥕', type: 'organic' },
  { id: '7', name: 'Pot de yaourt', emoji: '🥛', type: 'plastic' },
  { id: '8', name: 'Magazine', emoji: '📰', type: 'paper' },
  { id: '9', name: 'Peau d\'orange', emoji: '🍊', type: 'organic' },
  { id: '10', name: 'Canette', emoji: '🥤', type: 'metal' },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Quelle est la meilleure façon de composter en appartement ?',
    options: [
      'Utiliser un lombricomposteur',
      'Jeter les déchets par la fenêtre',
      'Tout mettre dans la poubelle normale',
      'Brûler les déchets organiques'
    ],
    correctAnswer: 0,
    explanation: 'Le lombricomposteur est parfait pour les appartements car il ne dégage pas d\'odeur et produit un excellent compost.'
  },
  {
    id: '2',
    question: 'Combien d\'eau peut-on économiser en prenant une douche au lieu d\'un bain ?',
    options: [
      '10 litres',
      '50 litres',
      '100 litres',
      '150 litres'
    ],
    correctAnswer: 2,
    explanation: 'Une douche consomme environ 60L d\'eau contre 160L pour un bain, soit 100L d\'économie.'
  },
  {
    id: '3',
    question: 'Quel transport émet le moins de CO2 par personne ?',
    options: [
      'Voiture électrique',
      'Vélo',
      'Transport en commun',
      'Covoiturage'
    ],
    correctAnswer: 1,
    explanation: 'Le vélo n\'émet aucun CO2 et est le moyen de transport le plus écologique en ville.'
  },
  {
    id: '4',
    question: 'Quelle ampoule consomme le moins d\'énergie ?',
    options: [
      'Ampoule à incandescence',
      'Ampoule halogène',
      'Ampoule LED',
      'Ampoule fluocompacte'
    ],
    correctAnswer: 2,
    explanation: 'Les ampoules LED consomment jusqu\'à 80% moins d\'énergie que les ampoules à incandescence.'
  },
  {
    id: '5',
    question: 'Combien de temps met un mégot de cigarette à se dégrader ?',
    options: [
      '1 an',
      '5 ans',
      '10 ans',
      '15 ans'
    ],
    correctAnswer: 2,
    explanation: 'Un mégot met environ 10 à 15 ans à se dégrader complètement dans la nature.'
  }
];

export const trueFalseQuestions: TrueFalseQuestion[] = [
  {
    id: '1',
    statement: 'Un chewing-gum met 5 ans à se dégrader.',
    answer: false,
    explanation: 'Un chewing-gum met en réalité 5 ans à se dégrader, mais cette durée peut aller jusqu\'à 20 ans selon les conditions.'
  },
  {
    id: '2',
    statement: 'Les LED consomment 80% moins d\'énergie que les ampoules classiques.',
    answer: true,
    explanation: 'C\'est exact ! Les LED sont très économes en énergie et durent plus longtemps.'
  },
  {
    id: '3',
    statement: 'Il faut rincer les bocaux en verre avant de les recycler.',
    answer: true,
    explanation: 'Il est important de rincer les contenants pour faciliter le recyclage et éviter les contaminations.'
  },
  {
    id: '4',
    statement: 'Les sacs plastiques peuvent être recyclés avec les autres plastiques.',
    answer: false,
    explanation: 'Les sacs plastiques nécessitent un recyclage spécifique et ne doivent pas être mélangés aux autres plastiques.'
  },
  {
    id: '5',
    statement: 'Laisser couler l\'eau en se brossant les dents gaspille 20 litres d\'eau.',
    answer: true,
    explanation: 'Fermer le robinet pendant le brossage permet d\'économiser jusqu\'à 20 litres d\'eau par brossage.'
  }
];

export const binTypes = [
  { id: 'plastic', name: 'Plastique', emoji: '♻️', color: 'blue' },
  { id: 'glass', name: 'Verre', emoji: '🍾', color: 'green' },
  { id: 'organic', name: 'Compost', emoji: '🌱', color: 'brown' },
  { id: 'paper', name: 'Papier', emoji: '📝', color: 'yellow' },
  { id: 'metal', name: 'Métal', emoji: '🔧', color: 'gray' }
];

export const badges = [
  { id: 'tri-master', name: 'Maître du Tri', emoji: '🗂️', description: 'Réussir 10 défis de tri' },
  { id: 'eco-expert', name: 'Expert Écolo', emoji: '🌱', description: 'Répondre correctement à 50 questions' },
  { id: 'speed-demon', name: 'Démon de la Vitesse', emoji: '⚡', description: 'Terminer un défi en moins de 10 secondes' },
  { id: 'perfectionist', name: 'Perfectionniste', emoji: '💯', description: 'Obtenir un score parfait' },
  { id: 'eco-warrior', name: 'Guerrier Écolo', emoji: '🏆', description: 'Compléter tous les types de défis' }
];
