import { SectorCard, StoryRound, TeamProfile } from '../types/economy';

const art = (name: string) => `/activity-art/${name}.webp`;

export const TEAMS: TeamProfile[] = [
  {
    id: 'teamA',
    name: 'Team Knowledge',
    avatarImage: art('avatar-boy'),
    sortTagline: 'Explore • Think • Sort',
    storyTagline: 'Plan • Arrange • Build',
  },
  {
    id: 'teamB',
    name: 'Team Heritage',
    avatarImage: art('avatar-girl'),
    sortTagline: 'Observe • Decide • Place',
    storyTagline: 'Think • Sequence • Share',
  },
];

// ---------------------------------------------------------------------------
// Activity 1 — Sector Sort
// ---------------------------------------------------------------------------

export const SECTOR_CARDS: SectorCard[] = [
  {
    id: 'rice',
    title: 'Growing rice in a field',
    sector: 'primary',
    image: art('sector-rice'),
    hint: 'Crops grow from soil, sun and rain — farming uses natural resources directly.',
  },
  {
    id: 'coal',
    title: 'Mining coal from the ground',
    sector: 'primary',
    image: art('sector-coal'),
    hint: 'Coal is dug straight out of the earth — mining takes resources from nature.',
  },
  {
    id: 'house',
    title: 'Building a house',
    sector: 'secondary',
    image: art('sector-house'),
    hint: 'Construction turns bricks, cement and steel into something new — a building.',
  },
  {
    id: 'milk',
    title: 'Processing milk in a factory',
    sector: 'secondary',
    image: art('sector-milk'),
    hint: 'A factory changes raw milk into packed milk, butter and cheese.',
  },
  {
    id: 'fruits',
    title: 'Selling fruits in a shop',
    sector: 'tertiary',
    image: art('sector-fruits'),
    hint: 'The shopkeeper does not grow or make the fruit — selling is a service.',
  },
  {
    id: 'teaching',
    title: 'Teaching students in a school',
    sector: 'tertiary',
    image: art('sector-teaching'),
    hint: 'Teachers share knowledge — teaching is a service, not a product.',
  },
  {
    id: 'fish',
    title: 'Catching fish in the sea',
    sector: 'primary',
    image: art('sector-fish'),
    hint: 'Fish are taken directly from the sea — fishing uses natural resources.',
  },
  {
    id: 'medical',
    title: 'Providing medical care in a hospital',
    sector: 'tertiary',
    image: art('sector-medical'),
    hint: 'Doctors and nurses give care — healthcare is a service.',
  },
  {
    id: 'restaurant',
    title: 'Working in a restaurant',
    sector: 'tertiary',
    image: art('sector-restaurant'),
    hint: 'Waiters and cooks serve customers — a restaurant provides a service.',
  },
  {
    id: 'truck',
    title: 'Transporting goods by truck',
    sector: 'tertiary',
    image: art('sector-truck'),
    hint: 'Moving goods from place to place is transport — a service.',
  },
  {
    id: 'it',
    title: 'Working in an IT company',
    sector: 'tertiary',
    image: art('sector-it'),
    hint: 'Software and computer help are services people pay for.',
  },
  {
    id: 'salon',
    title: 'Cutting hair in a salon',
    sector: 'tertiary',
    image: art('sector-salon'),
    hint: 'A haircut makes no new goods — the barber provides a service.',
  },
];

export const SECTOR_META = {
  primary: {
    title: 'Primary Sector',
    subtitle: 'Uses natural resources',
    image: art('col-primary'),
    examples: 'farming, fishing, mining',
  },
  secondary: {
    title: 'Secondary Sector',
    subtitle: 'Makes goods from raw materials',
    image: art('col-secondary'),
    examples: 'factories, construction',
  },
  tertiary: {
    title: 'Tertiary Sector',
    subtitle: 'Provides services',
    image: art('col-tertiary'),
    examples: 'teaching, transport, healthcare',
  },
} as const;

// ---------------------------------------------------------------------------
// Activity 2 — Amul Story Sequence
// ---------------------------------------------------------------------------

export const STORY_ROUNDS: StoryRound[] = [
  {
    id: 'amul-story',
    title: 'The Amul',
    titleAccent: 'Story',
    subtitle: 'How a small idea by farmers grew into a national success.',
    heroImage: art('amul-hero'),
    events: [
      {
        id: 'coop',
        order: 1,
        text: 'Farmers in Gujarat formed a cooperative to work together.',
        clue: 'It all began when farmers decided to join hands.',
        image: art('amul-coop'),
      },
      {
        id: 'collect',
        order: 2,
        text: 'Milk was collected daily from many villages.',
        clue: 'Once the cooperative existed, it started gathering milk.',
        image: art('amul-collect'),
      },
      {
        id: 'process',
        order: 3,
        text: 'Milk was processed into products like butter, cheese and milk powder.',
        clue: 'Collected milk is turned into products before it is sold.',
        image: art('amul-process'),
      },
      {
        id: 'brand',
        order: 4,
        text: 'Amul created a strong brand and smart marketing.',
        clue: 'Products needed a famous name so people would choose them.',
        image: art('amul-brand'),
      },
      {
        id: 'sold',
        order: 5,
        text: 'Amul products were sold across India.',
        clue: 'A well-known brand can reach shops in every state.',
        image: art('amul-sold'),
      },
      {
        id: 'farmers',
        order: 6,
        text: 'Farmers received better prices and lives improved.',
        clue: 'The happy ending — profits returned to the farmers.',
        image: art('amul-farmers'),
      },
    ],
  },
  {
    id: 'milk-journey',
    title: 'Farm to',
    titleAccent: 'Home',
    subtitle: 'Follow one glass of milk from the cow to a family breakfast.',
    heroImage: art('amul-hero'),
    events: [
      {
        id: 'milking',
        order: 1,
        text: 'Dairy farmers feed their cows and milk them at dawn.',
        clue: 'Milk must come from the cow before anything else.',
        illustrationKey: 'amul-milking',
      },
      {
        id: 'testing',
        order: 2,
        text: 'Milk is brought to the village society and tested for fat.',
        clue: 'Farmers carry their pails to the village centre right after milking.',
        illustrationKey: 'amul-collection',
      },
      {
        id: 'tanker',
        order: 3,
        text: 'Chilled milk travels in insulated tankers to the dairy.',
        clue: 'Raw milk travels from the village to the big plant.',
        illustrationKey: 'amul-tanker',
      },
      {
        id: 'plant',
        order: 4,
        text: 'The dairy plant pasteurises and packs the milk.',
        clue: 'Processing happens at the plant after the tanker arrives.',
        illustrationKey: 'amul-plant',
      },
      {
        id: 'parlour',
        order: 5,
        text: 'Vans deliver milk packets to parlours and shops.',
        clue: 'Packets reach the shops before families can buy them.',
        illustrationKey: 'amul-parlour',
      },
      {
        id: 'family',
        order: 6,
        text: 'Families buy the milk and enjoy it at home.',
        clue: 'Drinking the milk is the last step of the journey.',
        illustrationKey: 'amul-consumer',
      },
    ],
  },
];
