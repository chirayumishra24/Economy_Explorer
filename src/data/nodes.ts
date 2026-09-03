import { EconomicNode } from '../types/economy';

export const ECONOMIC_NODES: EconomicNode[] = [
  // --- PRIMARY SECTOR (Drawing directly from nature) ---
  {
    id: 'cotton-farm',
    label: 'Cotton Farm',
    sector: 'primary',
    who: 'Ramesh, a cotton farmer',
    doing: 'Grows cotton plants using soil, rain, and sunshine.',
    output: {
      kind: 'good',
      label: 'Raw Cotton Pods'
    },
    position: { x: 12, y: 22 },
    icon: 'farm',
    source: 'unverified'
  },
  {
    id: 'dairy-farm',
    label: 'Dairy Farm',
    sector: 'primary',
    who: 'Sunita, a dairy farmer',
    doing: 'Feeds dairy cows and collects fresh milk every morning.',
    output: {
      kind: 'good',
      label: 'Raw Fresh Milk'
    },
    position: { x: 12, y: 52 },
    icon: 'dairy',
    source: 'unverified'
  },
  {
    id: 'timber-forest',
    label: 'Timber Forest',
    sector: 'primary',
    who: 'Birju, a forest worker',
    doing: 'Gathers fallen timber logs carefully from the woodland.',
    output: {
      kind: 'good',
      label: 'Wood Logs'
    },
    position: { x: 12, y: 80 },
    icon: 'forest',
    source: 'unverified'
  },

  // --- SECONDARY SECTOR (Manufacturing and processing) ---
  {
    id: 'textile-mill',
    label: 'Textile Mill',
    sector: 'secondary',
    who: 'Anand, a mill worker',
    doing: 'Spins raw cotton into yarn and weaves it into cloth.',
    output: {
      kind: 'good',
      label: 'Woven Cotton Cloth'
    },
    position: { x: 48, y: 22 },
    icon: 'factory',
    source: 'unverified'
  },
  {
    id: 'dairy-plant',
    label: 'Dairy Plant',
    sector: 'secondary',
    who: 'Meera, a dairy technician',
    doing: 'Boils, cools, and packs milk into clean sealed pouches.',
    output: {
      kind: 'good',
      label: 'Packaged Milk'
    },
    position: { x: 48, y: 52 },
    icon: 'dairy-plant',
    source: 'unverified'
  },
  {
    id: 'furniture-workshop',
    label: 'Furniture Workshop',
    sector: 'secondary',
    who: 'Dev, a carpenter',
    doing: 'Cuts, smoothes, and crafts timber logs into sturdy desks.',
    output: {
      kind: 'good',
      label: 'Wooden School Desks'
    },
    position: { x: 48, y: 80 },
    icon: 'workshop',
    source: 'unverified'
  },

  // --- TERTIARY SECTOR (Supportive services) ---
  {
    id: 'transport-truck',
    label: 'Transport Truck',
    sector: 'tertiary',
    who: 'Jaspreet, a truck driver',
    doing: 'Carries materials and finished goods along highway routes.',
    output: {
      kind: 'service',
      label: 'Goods Transport'
    },
    position: { x: 30, y: 40 },
    icon: 'truck',
    source: 'unverified'
  },
  {
    id: 'cooperative-bank',
    label: 'Cooperative Bank',
    sector: 'tertiary',
    who: 'Priya, a bank manager',
    doing: 'Helps farmers and workshop owners save money and get loans.',
    output: {
      kind: 'service',
      label: 'Banking & Credit'
    },
    position: { x: 30, y: 68 },
    icon: 'bank',
    source: 'unverified'
  },
  {
    id: 'bazaar-shop',
    label: 'Village Bazaar Shop',
    sector: 'tertiary',
    who: 'Salim, a shopkeeper',
    doing: 'Stocks goods on shelves and sells them to village families.',
    output: {
      kind: 'service',
      label: 'Market Trading'
    },
    position: { x: 74, y: 40 },
    icon: 'shop',
    source: 'unverified'
  },
  {
    id: 'consumer-household',
    label: 'School & Household',
    sector: 'tertiary',
    who: 'Aarav and his classmates',
    doing: 'Buys shirts, drinks milk, and learns at school desks.',
    output: {
      kind: 'service',
      label: 'Consumer Living'
    },
    position: { x: 92, y: 52 },
    icon: 'consumer',
    source: 'unverified'
  }
];
