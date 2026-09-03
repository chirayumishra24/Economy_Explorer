import { Connection } from '../types/economy';

export const CONNECTIONS: Connection[] = [
  // Cotton value chain
  {
    id: 'conn-cotton-truck',
    from: 'cotton-farm',
    to: 'transport-truck',
    carries: 'Raw cotton pods',
    rationale: 'The farmer loads harvested cotton into the truck to travel to the mill.',
    wrongLinkFeedback: 'The farm produces raw cotton, which needs transport before it can reach the mill.'
  },
  {
    id: 'conn-truck-mill',
    from: 'transport-truck',
    to: 'textile-mill',
    carries: 'Raw cotton pods',
    rationale: 'The truck delivers raw cotton to the textile mill for spinning and weaving.',
    wrongLinkFeedback: 'Trucks carry raw materials directly to processing factories.'
  },
  {
    id: 'conn-mill-shop',
    from: 'textile-mill',
    to: 'bazaar-shop',
    carries: 'Stitched cotton shirts',
    rationale: 'The textile mill sends finished shirts to the bazaar shop for consumers.',
    wrongLinkFeedback: 'Finished cloth and shirts go from the factory to the market shop, not backward to the farm.'
  },

  // Milk value chain
  {
    id: 'conn-dairy-truck',
    from: 'dairy-farm',
    to: 'transport-truck',
    carries: 'Fresh raw milk cans',
    rationale: 'Daily fresh milk must quickly be driven to the chilling and processing plant.',
    wrongLinkFeedback: 'Raw milk needs cold transport to reach the processing plant safely.'
  },
  {
    id: 'conn-truck-dairyplant',
    from: 'transport-truck',
    to: 'dairy-plant',
    carries: 'Fresh raw milk cans',
    rationale: 'The truck delivers fresh milk to the dairy plant for pasteurization.',
    wrongLinkFeedback: 'Raw milk must reach the dairy plant before it can be packaged.'
  },
  {
    id: 'conn-dairyplant-shop',
    from: 'dairy-plant',
    to: 'bazaar-shop',
    carries: 'Packaged milk cartons',
    rationale: 'The plant sends clean, sealed milk cartons to the shop shelves.',
    wrongLinkFeedback: 'Packaged goods travel to the bazaar shop so people can buy them.'
  },

  // Wood value chain
  {
    id: 'conn-forest-truck',
    from: 'timber-forest',
    to: 'transport-truck',
    carries: 'Seasoned timber logs',
    rationale: 'Heavy timber logs must be moved by truck to the carpenter workshop.',
    wrongLinkFeedback: 'Timber logs need transport to reach the carpenter workshop.'
  },
  {
    id: 'conn-truck-workshop',
    from: 'transport-truck',
    to: 'furniture-workshop',
    carries: 'Timber logs',
    rationale: 'The truck delivers timber logs to Dev the carpenter.',
    wrongLinkFeedback: 'Raw logs go to the workshop where carpenters make desks.'
  },
  {
    id: 'conn-workshop-shop',
    from: 'furniture-workshop',
    to: 'bazaar-shop',
    carries: 'Finished wooden desks',
    rationale: 'The carpenter sends sturdy desks to the bazaar market.',
    wrongLinkFeedback: 'Finished furniture is sent to the market shop for delivery to schools.'
  },

  // Tertiary support: Shop to Consumer
  {
    id: 'conn-shop-consumer',
    from: 'bazaar-shop',
    to: 'consumer-household',
    carries: 'Goods to consumers',
    rationale: 'Consumers visit the shop in the market to buy goods for their homes and schools.',
    wrongLinkFeedback: 'Consumers buy finished goods from the market shop.'
  },

  // Support service: Cooperative Bank
  {
    id: 'conn-bank-farm',
    from: 'cooperative-bank',
    to: 'cotton-farm',
    carries: 'Loans for seeds & tools',
    rationale: 'The cooperative bank provides credit so farmers can buy good seeds and tools.',
    wrongLinkFeedback: 'Banks provide finance and loans to help farmers buy equipment.'
  },
  {
    id: 'conn-bank-mill',
    from: 'cooperative-bank',
    to: 'textile-mill',
    carries: 'Credit for machinery',
    rationale: 'The bank helps the mill finance weaving looms and pay electricity bills.',
    wrongLinkFeedback: 'Banks provide loans to factories to maintain machines and run operations.'
  }
];

// Feedback lookup for wrong connections attempted by students
export const WRONG_CONNECTION_FEEDBACK: Record<string, string> = {
  'bazaar-shop->cotton-farm': 'Cloth does not go from the shop back to the farm — the farmer grows raw cotton, so it must travel to the mill first.',
  'consumer-household->textile-mill': 'Consumers buy finished shirts from the market shop, not directly from high-speed factory looms.',
  'cotton-farm->bazaar-shop': 'Raw cotton cannot be worn as a shirt yet — it must first be spun and woven at the textile mill.',
  'timber-forest->consumer-household': 'Heavy tree logs cannot be used as study desks until the carpenter cuts and crafts them.',
  'dairy-farm->bazaar-shop': 'Raw milk should be pasteurized and sealed at the dairy plant first for safe drinking.',
  'textile-mill->cotton-farm': 'Factories do not send made goods back to the farm to be grown again.',
  'furniture-workshop->timber-forest': 'Desks are made from forest timber; they do not get planted back into the forest.',
};

export function getWrongLinkFeedback(fromId: string, toId: string): string {
  const key = `${fromId}->${toId}`;
  if (WRONG_CONNECTION_FEEDBACK[key]) {
    return WRONG_CONNECTION_FEEDBACK[key];
  }
  return 'Goods move from raw materials (nature) through factories (making) and transport (services) to the market shop.';
}
