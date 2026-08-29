import {
  ActivityMeta,
  AuctionItem,
  PictionaryWord,
  BuzzerScenario,
  SortItem,
  BoardTile,
  SupplyChainChallenge
} from '../types/economy';

// ─── Activity Hub Metadata ───────────────────────────────────────────

export const ACTIVITIES: ActivityMeta[] = [
  {
    id: 'sector-auction',
    title: 'Sector Auction War',
    description: 'Bid virtual currency on economy items and classify them into the correct sector. Wrong bids cost you!',
    icon: 'Gavel',
    mode: 'team',
    playerCount: '2 Teams',
    duration: '5–8 min',
    difficulty: 'Medium',
    concepts: ['Sector Classification', 'Strategy', 'Primary / Secondary / Tertiary']
  },
  {
    id: 'supply-chain-relay',
    title: 'Supply Chain Relay',
    description: 'Race to arrange production stages in the correct order — from raw material to consumer!',
    icon: 'Link',
    mode: 'team',
    playerCount: '2 Teams',
    duration: '6–10 min',
    difficulty: 'Hard',
    concepts: ['Value Chains', 'Sector Interdependence', 'Production Stages']
  },
  {
    id: 'economy-pictionary',
    title: 'Economy Pictionary',
    description: 'Describe economy words for your teammates to guess — without saying the word itself!',
    icon: 'MessageCircle',
    mode: 'team',
    playerCount: '2 Teams',
    duration: '8–12 min',
    difficulty: 'Easy',
    concepts: ['Economic Vocabulary', 'Worker Roles', 'Concepts']
  },
  {
    id: 'goods-vs-services',
    title: 'Goods vs Services Sort',
    description: 'Items fly in — smash them into the right bucket! Speed and accuracy both matter.',
    icon: 'ArrowLeftRight',
    mode: 'individual',
    playerCount: '2 Players',
    duration: '2–3 min',
    difficulty: 'Easy',
    concepts: ['Goods vs Services', 'Output Classification']
  },
  {
    id: 'buzzer-round',
    title: 'Economy Buzzer Round',
    description: 'A scenario appears — race to buzz first and identify the sector and output type!',
    icon: 'Zap',
    mode: 'individual',
    playerCount: '2 Players',
    duration: '5–7 min',
    difficulty: 'Medium',
    concepts: ['Sector Identification', 'Goods vs Services', 'Quick Thinking']
  },
  {
    id: 'snakes-ladders',
    title: 'Economy Snakes & Ladders',
    description: 'Roll the dice, answer economy questions, dodge recessions, and ride GDP booms!',
    icon: 'Dices',
    mode: 'individual',
    playerCount: '2 Players',
    duration: '8–15 min',
    difficulty: 'Medium',
    concepts: ['Mixed Economy Knowledge', 'All Sectors', 'Goods & Services']
  }
];

// ─── Sector Auction War Items ────────────────────────────────────────

export const AUCTION_ITEMS: AuctionItem[] = [
  { id: 'ai1', name: 'Wheat Farming', icon: 'Wheat', description: 'Growing wheat crops using soil and rainwater', correctSector: 'primary', baseValue: 100 },
  { id: 'ai2', name: 'Fishing in the Sea', icon: 'Fish', description: 'Catching fish from coastal waters with nets', correctSector: 'primary', baseValue: 100 },
  { id: 'ai3', name: 'Coal Mining', icon: 'Mountain', description: 'Extracting coal from underground mines', correctSector: 'primary', baseValue: 120 },
  { id: 'ai4', name: 'Dairy Farming', icon: 'Milk', description: 'Rearing cows for milk production', correctSector: 'primary', baseValue: 100 },
  { id: 'ai5', name: 'Forestry', icon: 'Trees', description: 'Collecting timber and wild honey from forests', correctSector: 'primary', baseValue: 110 },
  { id: 'ai6', name: 'Textile Mill', icon: 'Factory', description: 'Spinning cotton into thread and weaving cloth', correctSector: 'secondary', baseValue: 150 },
  { id: 'ai7', name: 'Sugar Milling', icon: 'Sparkles', description: 'Crushing sugarcane and crystallizing it into sugar', correctSector: 'secondary', baseValue: 140 },
  { id: 'ai8', name: 'Steel Making', icon: 'Hammer', description: 'Smelting iron ore into steel in blast furnaces', correctSector: 'secondary', baseValue: 160 },
  { id: 'ai9', name: 'Bread Baking', icon: 'Cookie', description: 'Grinding wheat into flour and baking bread in ovens', correctSector: 'secondary', baseValue: 130 },
  { id: 'ai10', name: 'Road Construction', icon: 'Building2', description: 'Using cement, bricks, and steel to build highways', correctSector: 'secondary', baseValue: 150 },
  { id: 'ai11', name: 'Truck Transport', icon: 'Truck', description: 'Moving goods from farms to city markets via highway', correctSector: 'tertiary', baseValue: 120 },
  { id: 'ai12', name: 'Kirana Shop', icon: 'Store', description: 'Selling daily essentials to neighbourhood residents', correctSector: 'tertiary', baseValue: 100 },
  { id: 'ai13', name: 'Banking Services', icon: 'Landmark', description: 'Providing savings accounts, loans, and UPI payments', correctSector: 'tertiary', baseValue: 140 },
  { id: 'ai14', name: 'Hospital Care', icon: 'Stethoscope', description: 'Diagnosing patients and providing medical treatment', correctSector: 'tertiary', baseValue: 130 },
  { id: 'ai15', name: 'School Teaching', icon: 'GraduationCap', description: 'Teaching social science and maths to students', correctSector: 'tertiary', baseValue: 110 },
  { id: 'ai16', name: 'Pottery Making', icon: 'Sparkles', description: 'Shaping natural clay into pots and baking in a kiln', correctSector: 'secondary', baseValue: 120 },
  { id: 'ai17', name: 'Cold Storage', icon: 'Boxes', description: 'Storing apples and milk in temperature-controlled rooms', correctSector: 'tertiary', baseValue: 130 },
  { id: 'ai18', name: 'Telecom Network', icon: 'PhoneCall', description: 'Providing mobile connectivity and internet services', correctSector: 'tertiary', baseValue: 140 },
  { id: 'ai19', name: 'Iron Ore Mining', icon: 'Mountain', description: 'Digging mineral ores from inside the Earth', correctSector: 'primary', baseValue: 130 },
  { id: 'ai20', name: 'Bicycle Assembly', icon: 'Bike', description: 'Bending steel tubes and fitting gears into a bicycle', correctSector: 'secondary', baseValue: 150 },
];

// ─── Economy Pictionary Words ────────────────────────────────────────

export const PICTIONARY_WORDS: PictionaryWord[] = [
  { id: 'pw1', word: 'Farmer', category: 'worker', difficulty: 'easy', hints: ['Works with soil', 'Grows food', 'Primary sector'] },
  { id: 'pw2', word: 'Factory', category: 'concept', difficulty: 'easy', hints: ['Has machines', 'Transforms raw materials', 'Secondary sector'] },
  { id: 'pw3', word: 'Kirana Shop', category: 'concept', difficulty: 'easy', hints: ['Neighbourhood store', 'Sells daily items', 'Tertiary sector'] },
  { id: 'pw4', word: 'AMUL Cooperative', category: 'concept', difficulty: 'hard', hints: ['Milk collection', 'Gujarat based', 'Farmer-owned'] },
  { id: 'pw5', word: 'Primary Sector', category: 'sector', difficulty: 'medium', hints: ['Nature-dependent', 'Farming and fishing', 'Raw materials'] },
  { id: 'pw6', word: 'Doctor', category: 'worker', difficulty: 'easy', hints: ['Treats patients', 'Works in clinic', 'Provides a service'] },
  { id: 'pw7', word: 'Truck Driver', category: 'worker', difficulty: 'easy', hints: ['Moves goods', 'Drives on highways', 'Connects farms to cities'] },
  { id: 'pw8', word: 'Supply Chain', category: 'concept', difficulty: 'hard', hints: ['Connected stages', 'Raw to finished', 'Multiple sectors involved'] },
  { id: 'pw9', word: 'Cotton T-Shirt', category: 'product', difficulty: 'medium', hints: ['Starts as a plant', 'Goes through spinning', 'You wear it'] },
  { id: 'pw10', word: 'Banking', category: 'concept', difficulty: 'medium', hints: ['Handles money', 'Gives loans', 'Savings accounts'] },
  { id: 'pw11', word: 'Fisherwoman', category: 'worker', difficulty: 'easy', hints: ['Uses nets', 'Works near water', 'Catches seafood'] },
  { id: 'pw12', word: 'Potter', category: 'worker', difficulty: 'medium', hints: ['Works with clay', 'Uses a wheel', 'Makes pots and diyas'] },
  { id: 'pw13', word: 'Secondary Sector', category: 'sector', difficulty: 'medium', hints: ['Manufacturing', 'Transforms materials', 'Factories and workshops'] },
  { id: 'pw14', word: 'Interdependence', category: 'concept', difficulty: 'hard', hints: ['Sectors need each other', 'Connected chain', 'One breaks all suffer'] },
  { id: 'pw15', word: 'Economic Activity', category: 'concept', difficulty: 'medium', hints: ['Done for income', 'Exchange of money', 'Not a hobby'] },
  { id: 'pw16', word: 'Textile Mill Worker', category: 'worker', difficulty: 'medium', hints: ['Operates looms', 'Makes cloth', 'Works in a factory'] },
  { id: 'pw17', word: 'Tertiary Sector', category: 'sector', difficulty: 'medium', hints: ['Services', 'No physical goods', 'Transport, banking, education'] },
  { id: 'pw18', word: 'Loaf of Bread', category: 'product', difficulty: 'easy', hints: ['Made from wheat flour', 'Baked in an oven', 'Breakfast item'] },
  { id: 'pw19', word: 'Warehouse', category: 'concept', difficulty: 'medium', hints: ['Storage building', 'Prevents spoilage', 'Cold storage'] },
  { id: 'pw20', word: 'Non-Economic Activity', category: 'concept', difficulty: 'hard', hints: ['Done out of love', 'No payment', 'Cooking at home for family'] },
];

// ─── Economy Buzzer Scenarios ────────────────────────────────────────

export const BUZZER_SCENARIOS: BuzzerScenario[] = [
  { id: 'bs1', description: 'Ramesh ploughs his farm field and harvests wheat under the sun.', personOrItem: 'Ramesh the Farmer', correctSector: 'primary', correctOutputType: 'good', explanation: 'Farming produces agricultural goods directly from nature — Primary Sector.' },
  { id: 'bs2', description: 'Shanti operates a spinning loom in a textile factory, turning cotton into cloth.', personOrItem: 'Shanti the Mill Worker', correctSector: 'secondary', correctOutputType: 'good', explanation: 'Manufacturing transforms raw cotton into finished cloth — Secondary Sector.' },
  { id: 'bs3', description: 'Anil sells groceries and daily essentials to local residents from his small shop.', personOrItem: 'Anil the Shopkeeper', correctSector: 'tertiary', correctOutputType: 'service', explanation: 'Retail trade provides distribution services — Tertiary Sector.' },
  { id: 'bs4', description: 'Dr. Priya examines a patient and prescribes medicine at her health clinic.', personOrItem: 'Dr. Priya the Doctor', correctSector: 'tertiary', correctOutputType: 'service', explanation: 'Healthcare provides medical services — Tertiary Sector.' },
  { id: 'bs5', description: 'Balwinder drives a heavy truck carrying farm produce to the city wholesale market.', personOrItem: 'Balwinder the Truck Driver', correctSector: 'tertiary', correctOutputType: 'service', explanation: 'Transportation provides mobility services connecting sectors — Tertiary Sector.' },
  { id: 'bs6', description: 'Kavita casts her fishing nets into the river early morning to catch fresh fish.', personOrItem: 'Kavita the Fisherwoman', correctSector: 'primary', correctOutputType: 'good', explanation: 'Fishing extracts food directly from water bodies — Primary Sector.' },
  { id: 'bs7', description: 'Gopal shapes natural clay on a potter\'s wheel and bakes it into pots in a kiln.', personOrItem: 'Gopal the Potter', correctSector: 'secondary', correctOutputType: 'good', explanation: 'Pottery transforms clay into finished goods — Secondary Sector.' },
  { id: 'bs8', description: 'Masterji teaches social science to middle school students.', personOrItem: 'Masterji the Teacher', correctSector: 'tertiary', correctOutputType: 'service', explanation: 'Education provides knowledge services — Tertiary Sector.' },
  { id: 'bs9', description: 'A bakery grinds wheat into flour, kneads dough, and bakes bread in large ovens.', personOrItem: 'Modern Bakery', correctSector: 'secondary', correctOutputType: 'good', explanation: 'Baking transforms grain into processed food — Secondary Sector.' },
  { id: 'bs10', description: 'A bank manager processes a farmer\'s loan application so he can buy a new tractor.', personOrItem: 'Bank Manager', correctSector: 'tertiary', correctOutputType: 'service', explanation: 'Banking provides financial services — Tertiary Sector.' },
  { id: 'bs11', description: 'Workers at a steel plant smelt iron ore in a blast furnace to make steel sheets.', personOrItem: 'Steel Plant', correctSector: 'secondary', correctOutputType: 'good', explanation: 'Steel making transforms raw ore into manufactured steel — Secondary Sector.' },
  { id: 'bs12', description: 'A cold storage facility keeps tonnes of apples fresh using refrigeration.', personOrItem: 'Cold Storage Facility', correctSector: 'tertiary', correctOutputType: 'service', explanation: 'Cold storage provides preservation services — Tertiary Sector.' },
  { id: 'bs13', description: 'Sunita harvests fresh cauliflower and tomatoes from her kitchen garden and sells them in the haat.', personOrItem: 'Sunita the Farmer', correctSector: 'primary', correctOutputType: 'good', explanation: 'Growing and selling vegetables is a primary sector activity producing goods.' },
  { id: 'bs14', description: 'A construction company uses cement, bricks, and steel to build a new highway bridge.', personOrItem: 'Construction Company', correctSector: 'secondary', correctOutputType: 'good', explanation: 'Construction transforms raw materials into built infrastructure — Secondary Sector.' },
  { id: 'bs15', description: 'A mobile network company installs towers so people can make calls and use the internet.', personOrItem: 'Telecom Company', correctSector: 'tertiary', correctOutputType: 'service', explanation: 'Telecommunication provides connectivity services — Tertiary Sector.' },
];

// ─── Goods vs Services Sort Items ────────────────────────────────────

export const SORT_ITEMS: SortItem[] = [
  { id: 'si1', name: 'Fresh Vegetables', icon: 'Carrot', description: 'Cauliflower and tomatoes from the farm', correctType: 'good', difficulty: 1 },
  { id: 'si2', name: 'Haircut', icon: 'Scissors', description: 'A barber cuts and styles your hair', correctType: 'service', difficulty: 1 },
  { id: 'si3', name: 'Cotton Cloth', icon: 'Shirt', description: 'Woven fabric from a textile mill', correctType: 'good', difficulty: 1 },
  { id: 'si4', name: 'Bus Ride', icon: 'Bus', description: 'Public transport from home to school', correctType: 'service', difficulty: 1 },
  { id: 'si5', name: 'Steel Rods', icon: 'Hammer', description: 'Manufactured steel bars for construction', correctType: 'good', difficulty: 1 },
  { id: 'si6', name: 'Doctor Visit', icon: 'Stethoscope', description: 'A doctor checks your health and prescribes medicine', correctType: 'service', difficulty: 1 },
  { id: 'si7', name: 'Loaf of Bread', icon: 'Cookie', description: 'Freshly baked bread from a bakery', correctType: 'good', difficulty: 1 },
  { id: 'si8', name: 'Bank Loan', icon: 'Landmark', description: 'A bank gives money to a farmer to buy seeds', correctType: 'service', difficulty: 2 },
  { id: 'si9', name: 'Earthen Pot', icon: 'Sparkles', description: 'A clay pot made by a traditional potter', correctType: 'good', difficulty: 1 },
  { id: 'si10', name: 'School Education', icon: 'GraduationCap', description: 'A teacher teaches maths and science', correctType: 'service', difficulty: 1 },
  { id: 'si11', name: 'Mobile Phone', icon: 'Smartphone', description: 'A manufactured electronic device', correctType: 'good', difficulty: 1 },
  { id: 'si12', name: 'Internet Service', icon: 'Wifi', description: 'A telecom company provides data connectivity', correctType: 'service', difficulty: 2 },
  { id: 'si13', name: 'Wooden Furniture', icon: 'Armchair', description: 'A carpenter builds a study desk from timber', correctType: 'good', difficulty: 1 },
  { id: 'si14', name: 'Courier Delivery', icon: 'Package', description: 'A delivery person brings your parcel to your door', correctType: 'service', difficulty: 2 },
  { id: 'si15', name: 'Gold Jewellery', icon: 'Gem', description: 'Rings and necklaces crafted by a goldsmith', correctType: 'good', difficulty: 2 },
  { id: 'si16', name: 'Legal Advice', icon: 'Scale', description: 'A lawyer helps you understand your rights', correctType: 'service', difficulty: 2 },
  { id: 'si17', name: 'Packaged Milk', icon: 'Milk', description: 'Pasteurized and packed in a tetra pack by AMUL', correctType: 'good', difficulty: 2 },
  { id: 'si18', name: 'Electricity Supply', icon: 'Zap', description: 'Power company delivers electricity to your home', correctType: 'service', difficulty: 3 },
  { id: 'si19', name: 'Raw Fish', icon: 'Fish', description: 'Fresh catch from the morning fish market', correctType: 'good', difficulty: 1 },
  { id: 'si20', name: 'Insurance Policy', icon: 'Shield', description: 'A company promises to cover your medical bills', correctType: 'service', difficulty: 3 },
  { id: 'si21', name: 'Coal', icon: 'Mountain', description: 'Black mineral extracted from underground mines', correctType: 'good', difficulty: 2 },
  { id: 'si22', name: 'Auto-Rickshaw Ride', icon: 'Car', description: 'A driver takes you from the station to your home', correctType: 'service', difficulty: 1 },
  { id: 'si23', name: 'Sugar', icon: 'Sparkles', description: 'White crystallized sugar from a sugar mill', correctType: 'good', difficulty: 1 },
  { id: 'si24', name: 'Cloud Storage', icon: 'Cloud', description: 'Google Drive stores your files online', correctType: 'service', difficulty: 3 },
  { id: 'si25', name: 'Bicycle', icon: 'Bike', description: 'A manufactured steel bicycle from a factory', correctType: 'good', difficulty: 1 },
  { id: 'si26', name: 'Warehousing', icon: 'Boxes', description: 'A cold store keeps apples fresh for 6 months', correctType: 'service', difficulty: 3 },
  { id: 'si27', name: 'Cotton Bales', icon: 'Wheat', description: 'Raw cotton harvested and packed from the farm', correctType: 'good', difficulty: 2 },
  { id: 'si28', name: 'Money Transfer (UPI)', icon: 'CreditCard', description: 'A bank processes your digital payment instantly', correctType: 'service', difficulty: 2 },
  { id: 'si29', name: 'Cement Bags', icon: 'Building2', description: 'Manufactured powder used in construction', correctType: 'good', difficulty: 2 },
  { id: 'si30', name: 'Weather Forecast', icon: 'CloudSun', description: 'Meteorological dept predicts tomorrow\'s rain', correctType: 'service', difficulty: 3 },
];

// ─── Supply Chain Relay Challenges ───────────────────────────────────

export const SUPPLY_CHAIN_CHALLENGES: SupplyChainChallenge[] = [
  {
    id: 'sc1',
    productName: 'Cotton T-Shirt',
    icon: 'Shirt',
    stages: [
      { id: 'sc1s1', text: 'Cotton farmer harvests raw cotton bolls from the field', sector: 'primary', correctOrder: 1 },
      { id: 'sc1s2', text: 'Truck driver transports cotton bales to the textile hub', sector: 'tertiary', correctOrder: 2 },
      { id: 'sc1s3', text: 'Textile mill spins thread, weaves cloth, and stitches the shirt', sector: 'secondary', correctOrder: 3 },
      { id: 'sc1s4', text: 'Clothing store displays and sells the shirt to customers', sector: 'tertiary', correctOrder: 4 },
      { id: 'sc1s5', text: 'Student buys and wears the comfortable cotton shirt', sector: 'tertiary', correctOrder: 5 },
    ],
    disruptionQuestion: 'What happens if all truck transport stops for 10 days?',
    disruptionOptions: [
      'Nothing changes — factories have unlimited raw material',
      'Cotton piles up on farms, mills shut down, shops go empty',
      'Only farmers are affected, everyone else is fine',
      'Consumers just switch to a different material'
    ],
    disruptionCorrectIndex: 1
  },
  {
    id: 'sc2',
    productName: 'Loaf of Bread',
    icon: 'Cookie',
    stages: [
      { id: 'sc2s1', text: 'Wheat farmer grows and harvests golden wheat grains', sector: 'primary', correctOrder: 1 },
      { id: 'sc2s2', text: 'Flour mill grinds wheat into fine flour (atta)', sector: 'secondary', correctOrder: 2 },
      { id: 'sc2s3', text: 'Bakery kneads dough with yeast and bakes bread in ovens', sector: 'secondary', correctOrder: 3 },
      { id: 'sc2s4', text: 'Delivery van brings fresh bread to the grocery store at 6 AM', sector: 'tertiary', correctOrder: 4 },
      { id: 'sc2s5', text: 'Family buys the bread and enjoys toast for breakfast', sector: 'tertiary', correctOrder: 5 },
    ],
    disruptionQuestion: 'What happens if there is a severe drought and wheat crop fails?',
    disruptionOptions: [
      'Bakeries can still make bread from stored flour forever',
      'Only farmers lose income, rest of the chain is unaffected',
      'Flour becomes scarce and expensive → bread prices rise → everyone in the chain suffers',
      'People simply eat rice instead, no economic impact'
    ],
    disruptionCorrectIndex: 2
  },
  {
    id: 'sc3',
    productName: 'Steel Bicycle',
    icon: 'Bike',
    stages: [
      { id: 'sc3s1', text: 'Miners extract iron ore rocks from underground mines', sector: 'primary', correctOrder: 1 },
      { id: 'sc3s2', text: 'Steel plant smelts iron ore in blast furnaces to make steel', sector: 'secondary', correctOrder: 2 },
      { id: 'sc3s3', text: 'Bicycle factory bends steel tubes, fits gears, chain, and wheels', sector: 'secondary', correctOrder: 3 },
      { id: 'sc3s4', text: 'Bicycle dealership sells the finished bicycle to a customer', sector: 'tertiary', correctOrder: 4 },
      { id: 'sc3s5', text: 'Child rides the bicycle to school every day', sector: 'tertiary', correctOrder: 5 },
    ],
    disruptionQuestion: 'What happens if the steel plant workers go on strike?',
    disruptionOptions: [
      'Mining stops because there is no buyer for the ore',
      'Nothing changes — bicycles can be made from plastic',
      'Only the steel plant loses money',
      'Iron ore piles up unsold, bicycle factories have no steel, dealerships have no stock — all connected sectors suffer'
    ],
    disruptionCorrectIndex: 3
  },
  {
    id: 'sc4',
    productName: 'Packaged Milk (AMUL)',
    icon: 'Milk',
    stages: [
      { id: 'sc4s1', text: 'Village dairy farmer milks cows and brings milk to the collection centre', sector: 'primary', correctOrder: 1 },
      { id: 'sc4s2', text: 'Chilling centre cools milk to 4°C to prevent spoilage', sector: 'secondary', correctOrder: 2 },
      { id: 'sc4s3', text: 'AMUL dairy plant pasteurizes, homogenizes, and packages milk', sector: 'secondary', correctOrder: 3 },
      { id: 'sc4s4', text: 'Refrigerated truck delivers milk packets to city shops at dawn', sector: 'tertiary', correctOrder: 4 },
      { id: 'sc4s5', text: 'Family buys fresh AMUL milk for morning tea and cereal', sector: 'tertiary', correctOrder: 5 },
    ],
    disruptionQuestion: 'What happens if the chilling centre breaks down in summer?',
    disruptionOptions: [
      'Milk stays fresh naturally — no problem',
      'Milk spoils within hours in heat, farmers lose income, city shops have no milk',
      'Only the chilling centre loses money',
      'Farmers just sell directly to consumers'
    ],
    disruptionCorrectIndex: 1
  },
  {
    id: 'sc5',
    productName: 'Wooden Study Desk',
    icon: 'Boxes',
    stages: [
      { id: 'sc5s1', text: 'Forester harvests timber logs from managed tree plantations', sector: 'primary', correctOrder: 1 },
      { id: 'sc5s2', text: 'Sawmill cuts round logs into flat dried planks', sector: 'secondary', correctOrder: 2 },
      { id: 'sc5s3', text: 'Carpenter joins, glues, and polishes planks into a study desk', sector: 'secondary', correctOrder: 3 },
      { id: 'sc5s4', text: 'Furniture showroom displays and sells the desk to a family', sector: 'tertiary', correctOrder: 4 },
      { id: 'sc5s5', text: 'Student uses the desk at home for studying and keeping books', sector: 'tertiary', correctOrder: 5 },
    ],
    disruptionQuestion: 'What happens if deforestation bans stop all timber harvesting?',
    disruptionOptions: [
      'Carpenters can work without wood',
      'Only the forest department is affected',
      'Sawmills have no logs, carpenters have no planks, furniture shops are empty — entire chain collapses',
      'Students just study on the floor, no economic impact'
    ],
    disruptionCorrectIndex: 2
  }
];

// ─── Snakes & Ladders Board ─────────────────────────────────────────

function createBoard(): BoardTile[] {
  const tiles: BoardTile[] = [];

  for (let i = 1; i <= 36; i++) {
    tiles.push({ position: i, type: 'normal' });
  }

  // Ladders (GDP Booms)
  tiles[3 - 1] = { position: 3, type: 'ladder', ladderTo: 11, label: '📈 GDP Boom!' };
  tiles[8 - 1] = { position: 8, type: 'ladder', ladderTo: 16, label: '🚀 Export Growth!' };
  tiles[17 - 1] = { position: 17, type: 'ladder', ladderTo: 26, label: '🏭 Industrialization!' };
  tiles[21 - 1] = { position: 21, type: 'ladder', ladderTo: 32, label: '💡 Innovation Boom!' };

  // Snakes (Recessions)
  tiles[14 - 1] = { position: 14, type: 'snake', snakeTo: 6, label: '🐍 Recession!' };
  tiles[24 - 1] = { position: 24, type: 'snake', snakeTo: 15, label: '🐍 Drought!' };
  tiles[30 - 1] = { position: 30, type: 'snake', snakeTo: 20, label: '🐍 Market Crash!' };
  tiles[35 - 1] = { position: 35, type: 'snake', snakeTo: 27, label: '🐍 Supply Chain Break!' };

  // Question tiles
  const questions: BoardTile['question'][] = [
    { text: 'Which sector does farming belong to?', options: ['Primary', 'Secondary', 'Tertiary'], correctIndex: 0, explanation: 'Farming directly uses natural resources — Primary Sector.' },
    { text: 'Is a "haircut" a good or a service?', options: ['Good', 'Service'], correctIndex: 1, explanation: 'A haircut cannot be stored or touched — it is a service.' },
    { text: 'Which sector does a textile factory belong to?', options: ['Primary', 'Secondary', 'Tertiary'], correctIndex: 1, explanation: 'Manufacturing transforms raw materials — Secondary Sector.' },
    { text: 'What does AMUL stand for?', options: ['Anand Milk Union Limited', 'All Milk Utility Ltd', 'Amul Milk Unlimited'], correctIndex: 0, explanation: 'AMUL = Anand Milk Union Limited, a dairy cooperative.' },
    { text: 'Banking belongs to which sector?', options: ['Primary', 'Secondary', 'Tertiary'], correctIndex: 2, explanation: 'Banking provides financial services — Tertiary Sector.' },
    { text: 'Is "coal" a good or a service?', options: ['Good', 'Service'], correctIndex: 0, explanation: 'Coal is a physical material you can touch and store — it is a good.' },
    { text: 'What makes an activity "economic"?', options: ['Done for fun', 'Done for income or livelihood', 'Done at home'], correctIndex: 1, explanation: 'Economic activities are performed in exchange for money or livelihood.' },
    { text: 'Which is NOT a primary activity?', options: ['Fishing', 'Mining', 'Teaching'], correctIndex: 2, explanation: 'Teaching is a service — Tertiary Sector.' },
    { text: 'A mother cooking at home is what type of activity?', options: ['Economic', 'Non-economic'], correctIndex: 1, explanation: 'Done out of love, not for payment — Non-economic.' },
    { text: 'Cold storage belongs to which sector?', options: ['Primary', 'Secondary', 'Tertiary'], correctIndex: 2, explanation: 'Storage provides preservation services — Tertiary Sector.' },
    { text: 'Bread is made from wheat. Baking bread is which sector?', options: ['Primary', 'Secondary', 'Tertiary'], correctIndex: 1, explanation: 'Baking transforms grain into a finished product — Secondary Sector.' },
    { text: 'Transporting goods by truck is which sector?', options: ['Primary', 'Secondary', 'Tertiary'], correctIndex: 2, explanation: 'Transportation provides mobility services — Tertiary Sector.' },
  ];

  const questionPositions = [2, 5, 7, 10, 12, 16, 19, 22, 25, 28, 31, 34];
  questionPositions.forEach((pos, i) => {
    if (i < questions.length) {
      tiles[pos - 1] = { position: pos, type: 'question', question: questions[i] };
    }
  });

  return tiles;
}

export const BOARD_TILES: BoardTile[] = createBoard();

// ─── Team Color Presets ──────────────────────────────────────────────

export const TEAM_COLORS = [
  { name: 'Emerald', bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-300', hex: '#10B981' },
  { name: 'Blue', bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-300', hex: '#3B82F6' },
  { name: 'Amber', bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-300', hex: '#F59E0B' },
  { name: 'Rose', bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-300', hex: '#F43F5E' },
];
