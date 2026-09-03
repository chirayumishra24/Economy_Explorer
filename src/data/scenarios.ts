import { Scenario } from '../types/economy';

export const SCENARIOS: Scenario[] = [
  {
    id: 'scenario-transport-blocked',
    title: 'Highway Flooded: Truck Route Blocked',
    trigger: 'Heavy monsoon rains flood the highway, stopping all transport trucks.',
    description: 'Trucks cannot move between rural farms, factories, and the bazaar market.',
    affectedIds: ['transport-truck', 'textile-mill', 'dairy-plant', 'bazaar-shop', 'consumer-household'],
    predictions: [
      {
        id: 'p1-correct',
        text: 'Raw materials stay stuck at farms, and finished goods stop reaching the bazaar shop.',
        correct: true
      },
      {
        id: 'p1-wrong-1',
        text: 'Farmers will easily carry heavy timber and cotton on foot to city shops.',
        correct: false,
        whyNot: 'Farms are miles away from town. Carrying heavy goods requires motor transport.'
      },
      {
        id: 'p1-wrong-2',
        text: 'Only the truck driver is affected; factory looms make shirts without cotton.',
        correct: false,
        whyNot: 'Factories cannot spin yarn without raw cotton delivered to their doors.'
      }
    ],
    ripple: [
      { nodeId: 'transport-truck', effect: 'Truck engines stop. Vehicles are stranded on flooded roads.', order: 1 },
      { nodeId: 'textile-mill', effect: 'Raw cotton does not arrive. Weaving machines sit idle.', order: 2 },
      { nodeId: 'dairy-plant', effect: 'Fresh milk cans are delayed. Chilling tanks remain empty.', order: 2 },
      { nodeId: 'bazaar-shop', effect: 'No new shirts or milk cartons reach the shop shelves.', order: 3 },
      { nodeId: 'consumer-household', effect: 'Families visit the bazaar but find empty shelves.', order: 4 }
    ],
    observed: 'Raw materials remained stuck at farms. Factories had no work, and shop shelves sat empty.',
    whyItHappened: 'Producers and shops depend on transport services to move goods from one stage to another.',
    keyIdea: 'All three sectors are linked in a chain. When transport stops, the entire chain stops.',
    source: 'unverified'
  },
  {
    id: 'scenario-cotton-drought',
    title: 'Severe Drought: Cotton Crop Fails',
    trigger: 'A severe drought leaves cotton fields dry with no harvest this season.',
    description: 'Farmer Ramesh cannot harvest raw cotton pods from the withered plants.',
    affectedIds: ['cotton-farm', 'transport-truck', 'textile-mill', 'bazaar-shop', 'consumer-household'],
    predictions: [
      {
        id: 'p2-correct',
        text: 'With no raw cotton harvested, mill looms sit idle and shops have fewer shirts.',
        correct: true
      },
      {
        id: 'p2-wrong-1',
        text: 'The textile mill will manufacture cotton shirts out of plain air.',
        correct: false,
        whyNot: 'Factories cannot manufacture goods without natural raw materials from the primary sector.'
      },
      {
        id: 'p2-wrong-2',
        text: 'The village shopkeeper will grow cotton inside the grocery shop.',
        correct: false,
        whyNot: 'Shopkeepers provide a retail service in markets; they do not farm crops.'
      }
    ],
    ripple: [
      { nodeId: 'cotton-farm', effect: 'Crops wither in the dry soil. There is no cotton to harvest.', order: 1 },
      { nodeId: 'transport-truck', effect: 'Trucks have no cotton bales to load at the farm.', order: 2 },
      { nodeId: 'textile-mill', effect: 'Spindles and looms stop spinning because there is no yarn.', order: 3 },
      { nodeId: 'bazaar-shop', effect: 'Fewer new cotton shirts arrive on the market racks.', order: 4 }
    ],
    observed: 'Without crops from nature, factory workers had no work and shops received fewer shirts.',
    whyItHappened: 'Secondary manufacturing depends directly on the primary sector for raw materials.',
    keyIdea: 'Every manufactured object in daily life begins with natural resources.',
    source: 'unverified'
  },
  {
    id: 'scenario-mill-powercut',
    title: 'Power Outage: Textile Mill Halts',
    trigger: 'A power grid breakdown shuts down all spinning machines at the mill.',
    description: 'Weaving machinery stops running while raw cotton sits in the factory yard.',
    affectedIds: ['textile-mill', 'bazaar-shop', 'consumer-household'],
    predictions: [
      {
        id: 'p3-correct',
        text: 'Raw cotton piles up at the factory, while shop shelves run out of shirts.',
        correct: true
      },
      {
        id: 'p3-wrong-1',
        text: 'Cotton plants in the fields immediately stop growing.',
        correct: false,
        whyNot: 'Plants in farm fields keep growing even when machines in town stop.'
      },
      {
        id: 'p3-wrong-2',
        text: 'Consumers can wear raw unspun cotton pods straight to school.',
        correct: false,
        whyNot: 'Raw cotton must be spun, woven, and stitched before it can be worn.'
      }
    ],
    ripple: [
      { nodeId: 'textile-mill', effect: 'Power fails. Looms and sewing machines come to a complete halt.', order: 1 },
      { nodeId: 'bazaar-shop', effect: 'Shirt deliveries stop. Market racks slowly become bare.', order: 2 },
      { nodeId: 'consumer-household', effect: 'Students looking for school uniforms find none available.', order: 3 }
    ],
    observed: 'Raw cotton waited in storage while the bazaar shop ran out of shirts to sell.',
    whyItHappened: 'Secondary activities transform natural materials into goods that people can actually use.',
    keyIdea: 'Secondary activities turn raw materials into useful finished goods.',
    source: 'unverified'
  },
  {
    id: 'scenario-bank-holiday',
    title: 'Bank Counters Closed: Loan Delays',
    trigger: 'The cooperative bank halts operations for computer maintenance.',
    description: 'Farmers and transporters cannot deposit earnings or get loans for supplies.',
    affectedIds: ['cooperative-bank', 'cotton-farm', 'transport-truck'],
    predictions: [
      {
        id: 'p4-correct',
        text: 'Producers and drivers face delays buying seeds and diesel fuel.',
        correct: true
      },
      {
        id: 'p4-wrong-1',
        text: 'Farms instantly produce double the amount of crops with no money.',
        correct: false,
        whyNot: 'Farming needs funds to buy seeds, fertilizer, and tools.'
      },
      {
        id: 'p4-wrong-2',
        text: 'Banking is not an economic activity and has no effect on anyone.',
        correct: false,
        whyNot: 'Banking is a vital tertiary service that supports producers and traders.'
      }
    ],
    ripple: [
      { nodeId: 'cooperative-bank', effect: 'Bank doors close. Loan and payment counters pause.', order: 1 },
      { nodeId: 'cotton-farm', effect: 'Farmer Ramesh waits for credit to buy certified seeds.', order: 2 },
      { nodeId: 'transport-truck', effect: 'Driver Jaspreet waits for funds to replace worn truck tires.', order: 3 }
    ],
    observed: 'Farming and transport slowed down because people could not access financial support.',
    whyItHappened: 'Tertiary services do not make physical goods, but they support primary and secondary producers.',
    keyIdea: 'Tertiary services support the people who make and move goods.',
    source: 'unverified'
  }
];
