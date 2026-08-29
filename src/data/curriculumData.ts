import {
  WorkerProfile,
  EconomicCheckScenario,
  ActivityCard,
  TransformationPipeline,
  ServicePillar,
  ValueChain,
  AmulStage,
  ThinkPrompt,
  MisconceptionItem,
  ConceptNode
} from '../types/economy';

export const WORKER_PROFILES: WorkerProfile[] = [
  {
    id: 'w1',
    name: 'Ramesh Patel',
    role: 'Farmer',
    icon: 'Tractor',
    whatTheyDo: 'Ploughs the land, sows seeds, irrigates crops, and harvests wheat and cotton using soil, water, and sunlight.',
    whatTheyProvide: 'Agricultural Goods (food grains, vegetables, raw cotton).',
    outputType: 'good',
    sector: 'primary',
    whyEarns: 'Sells the harvested crops in the mandi/market to earn income to support his family and buy farming supplies.',
    ncertConnection: 'NCERT Chapter 14: Primary Activities — Agriculture directly draws on natural resources (soil, rain, sunshine).'
  },
  {
    id: 'w2',
    name: 'Shanti Devi',
    role: 'Textile Mill Worker',
    icon: 'Factory',
    whatTheyDo: 'Operates spinning looms in a textile factory to spin raw cotton fibres into yarn and weave them into cotton fabric.',
    whatTheyProvide: 'Processed Goods (woven cotton cloth, stitched garments).',
    outputType: 'good',
    sector: 'secondary',
    whyEarns: 'Receives monthly wages from the factory management for manufacturing cloth products.',
    ncertConnection: 'NCERT Chapter 14: Secondary Activities — Manufacturing processes raw materials into usable goods.'
  },
  {
    id: 'w3',
    name: 'Anil Sharma',
    role: 'Shopkeeper (Kirana)',
    icon: 'Store',
    whatTheyDo: 'Maintains an inventory of daily essentials like grains, soap, salt, and notebooks, and sells them directly to local residents.',
    whatTheyProvide: 'Trade & Distribution Service (making goods accessible in neighbourhood).',
    outputType: 'service',
    sector: 'tertiary',
    whyEarns: 'Earns a livelihood through the profit margin between wholesale purchase price and retail sales.',
    ncertConnection: 'NCERT Chapter 14: Tertiary Activities — Trade connects producers with consumers.'
  },
  {
    id: 'w4',
    name: 'Dr. Priya Nair',
    role: 'Doctor',
    icon: 'Stethoscope',
    whatTheyDo: 'Diagnoses illnesses, prescribes treatments, monitors health, and performs medical check-ups at the community health clinic.',
    whatTheyProvide: 'Healthcare Service (medical care and health guidance).',
    outputType: 'service',
    sector: 'tertiary',
    whyEarns: 'Earns professional consultation fees or a salary for her medical knowledge, care, and time.',
    ncertConnection: 'NCERT Chapter 14: Tertiary Activities — Healthcare provides essential services for human wellbeing.'
  },
  {
    id: 'w5',
    name: 'Masterji Arvind',
    role: 'School Teacher',
    icon: 'GraduationCap',
    whatTheyDo: 'Teaches social science, mathematics, and languages to middle school students, fostering knowledge and skills.',
    whatTheyProvide: 'Educational Service (teaching and mentoring).',
    outputType: 'service',
    sector: 'tertiary',
    whyEarns: 'Receives a monthly salary from the government or school institution for teaching students.',
    ncertConnection: 'NCERT Chapter 14: Tertiary Activities — Education does not produce physical goods, but provides human services.'
  },
  {
    id: 'w6',
    name: 'Balwinder Singh',
    role: 'Truck Driver',
    icon: 'Truck',
    whatTheyDo: 'Drives a heavy freight truck carrying agricultural produce from village farms to city wholesale markets and factories.',
    whatTheyProvide: 'Transportation Service (moving goods across locations).',
    outputType: 'service',
    sector: 'tertiary',
    whyEarns: 'Paid freight charges or transport wages by traders and factory owners for moving cargo safely.',
    ncertConnection: 'NCERT Chapter 14: Interdependence — Transportation is the vital bridge connecting all economic sectors.'
  },
  {
    id: 'w7',
    name: 'Kavita Barman',
    role: 'Fisherwoman',
    icon: 'Fish',
    whatTheyDo: 'Casts nets into coastal waters and rivers early morning to catch fish, crabs, and prawns.',
    whatTheyProvide: 'Natural Food Goods (fresh fish and seafood).',
    outputType: 'good',
    sector: 'primary',
    whyEarns: 'Sells fresh catch at the morning fish market to retailers and households.',
    ncertConnection: 'NCERT Chapter 14: Primary Activities — Fishing extracts food resources directly from natural water bodies.'
  },
  {
    id: 'w8',
    name: 'Gopal Kumhar',
    role: 'Traditional Potter & Craftsperson',
    icon: 'Sparkles',
    whatTheyDo: 'Takes natural clay, shapes it on a potter wheel into pots, diyas, and matkas, and bakes them in a kiln.',
    whatTheyProvide: 'Crafted Goods (earthen pots, water coolers, cookware).',
    outputType: 'good',
    sector: 'secondary',
    whyEarns: 'Sells hand-crafted clay pots in the weekly market and during festival seasons to earn his family income.',
    ncertConnection: 'NCERT Chapter 14: Secondary Activities — Transforming clay into finished pots is manufacturing/craft processing.'
  }
];

export const ECONOMIC_CHECK_SCENARIOS: EconomicCheckScenario[] = [
  {
    id: 'ec1',
    title: 'Cooking in a Restaurant vs Cooking at Home',
    context: 'Chef Vikram cooks aromatic biryani and curries in a local restaurant for customers who pay the bill.',
    person: 'Chef Vikram (Restaurant Chef)',
    action: 'Cooking meals in the restaurant kitchen for paying guests',
    isEconomic: true,
    whyExplanation: 'Vikram receives a salary and the restaurant charges customers for the food. This creates an exchange of money and provides a livelihood.',
    keyLearning: 'When work is done in exchange for income, wages, or profit, it is an ECONOMIC activity.',
    ncertRef: 'NCERT Chapter 14: Introduction to Economic Activities'
  },
  {
    id: 'ec2',
    title: 'Mother Cooking Dinner for the Family',
    context: 'Vikram’s mother cooks the exact same nutritious biryani and vegetables at home for her family members with affection.',
    person: 'Mother (At home)',
    action: 'Cooking dinner for her children and family out of love and care',
    isEconomic: false,
    whyExplanation: 'Even though tremendous effort and skill are involved, no money is paid or earned. It is done out of love, care, and family responsibility.',
    keyLearning: 'Activities performed purely out of love, care, social duty, or hobby without monetary exchange are NON-ECONOMIC activities.',
    ncertRef: 'NCERT Chapter 14: Economic vs Non-Economic distinction'
  },
  {
    id: 'ec3',
    title: 'Doctor Treating Patients at Clinic',
    context: 'Dr. Priya treats sick patients at her medical clinic and receives consultation fees to run her clinic.',
    person: 'Dr. Priya (Doctor in Clinic)',
    action: 'Diagnosing patients and writing prescriptions for consultation fees',
    isEconomic: true,
    whyExplanation: 'She provides professional medical services in exchange for fees that earn her a livelihood.',
    keyLearning: 'Professional services rendered for payment are economic activities.',
    ncertRef: 'NCERT Chapter 14: Tertiary Services'
  },
  {
    id: 'ec4',
    title: 'Father Helping Child with Homework',
    context: 'Sunil, who is a school teacher by profession, spends 1 hour every evening helping his young daughter solve mathematics homework.',
    person: 'Sunil (Father at home)',
    action: 'Teaching his own daughter arithmetic at home',
    isEconomic: false,
    whyExplanation: 'Teaching his own daughter is done out of parental duty and care. No school fee or salary is paid for this.',
    keyLearning: 'The exact same skill (teaching) becomes non-economic when done for family without compensation.',
    ncertRef: 'NCERT Chapter 14: Nature of Economic Activity'
  },
  {
    id: 'ec5',
    title: 'Farmer Selling Vegetables in the Market',
    context: 'Sunita harvests fresh cauliflower and tomatoes from her field and loads them onto a cart to sell at the weekly village haat.',
    person: 'Sunita (Vegetable Farmer)',
    action: 'Selling fresh vegetables in the village market to buyers',
    isEconomic: true,
    whyExplanation: 'She sells agricultural produce to earn money that buys clothes, medicines, and farming equipment.',
    keyLearning: 'Producing and selling goods in the market to earn money is an economic activity.',
    ncertRef: 'NCERT Chapter 14: Primary Sector Production'
  },
  {
    id: 'ec6',
    title: 'Gardening Flowers on the Balcony for Hobby',
    context: 'Rohan waters marigolds and roses in pots on his balcony during the weekend because he loves watching flowers bloom.',
    person: 'Rohan (Gardening enthusiast)',
    action: 'Watering and tending to potted balcony flowers for personal enjoyment',
    isEconomic: false,
    whyExplanation: 'Rohan does this for personal happiness and leisure. The flowers are not sold in the market.',
    keyLearning: 'Hobbies and leisure activities done for personal joy without commercial intent are non-economic.',
    ncertRef: 'NCERT Chapter 14: Concept Clarification'
  }
];

export const ACTIVITY_CARDS: ActivityCard[] = [
  // Primary
  {
    id: 'act1',
    name: 'Farming / Agriculture',
    icon: 'Wheat',
    description: 'Cultivating soil, planting crops like rice, wheat, pulses, and sugarcane directly using nature.',
    sector: 'primary',
    reason: 'Depends directly on natural elements: fertile soil, rainwater, and sunlight to produce biological crops.',
    natureResource: 'Soil, Rain, Sunshine, Seeds'
  },
  {
    id: 'act2',
    name: 'Fishing',
    icon: 'Fish',
    description: 'Harvesting fish, prawns, and aquatic life directly from oceans, rivers, and lakes.',
    sector: 'primary',
    reason: 'Gathers naturally existing living resources from water bodies without chemical factory processing.',
    natureResource: 'Rivers, Lakes, Coastal Oceans'
  },
  {
    id: 'act3',
    name: 'Forestry & Timber Gathering',
    icon: 'Trees',
    description: 'Collecting timber, firewood, rubber sap, wild honey, and medicinal herbs from forests.',
    sector: 'primary',
    reason: 'Direct extraction of natural plant and forest produce.',
    natureResource: 'Natural Forest Ecosystems'
  },
  {
    id: 'act4',
    name: 'Mining & Quarrying',
    icon: 'Mountain',
    description: 'Digging out mineral ores (iron ore, bauxite, coal) and stone directly from the Earth’s crust.',
    sector: 'primary',
    reason: 'Extracts non-renewable natural mineral resources directly from underground geological formations.',
    natureResource: 'Earth Mineral Deposits & Rocks'
  },
  {
    id: 'act5',
    name: 'Animal Husbandry / Dairy Farming',
    icon: 'Milk',
    description: 'Rearing cows, buffalos, sheep, and poultry for milk, wool, and eggs.',
    sector: 'primary',
    reason: 'Relies on biological processes of animals fed on natural fodder and water.',
    natureResource: 'Livestock Animals, Grass, Pastures'
  },
  // Secondary
  {
    id: 'act6',
    name: 'Textile Manufacturing',
    icon: 'Shirt',
    description: 'Spinning raw cotton lint into thread and weaving it on looms into cotton fabric and garments.',
    sector: 'secondary',
    reason: 'Transforms the primary raw material (cotton) into a new finished product (cloth) with tools and machines.',
    transformedFrom: 'Raw Cotton from Farms'
  },
  {
    id: 'act7',
    name: 'Sugar Milling',
    icon: 'Sparkles',
    description: 'Crushing harvested sugarcane stems, extracting juice, boiling, and crystallizing it into white sugar and jaggery.',
    sector: 'secondary',
    reason: 'Converts perishable sugarcane crop into durable, processed food products in a mill.',
    transformedFrom: 'Sugarcane Crop'
  },
  {
    id: 'act8',
    name: 'Steel Making',
    icon: 'Hammer',
    description: 'Smelting iron ore in blast furnaces with coke and limestone to produce steel bars and sheets.',
    sector: 'secondary',
    reason: 'Transforms raw iron ore into versatile industrial steel through manufacturing processes.',
    transformedFrom: 'Iron Ore from Mines'
  },
  {
    id: 'act9',
    name: 'Building & Road Construction',
    icon: 'Building2',
    description: 'Using cement, bricks, sand, steel rods, and stone aggregate to build homes, bridges, and highways.',
    sector: 'secondary',
    reason: 'Combines and processes various raw/manufactured materials into durable physical infrastructure.',
    transformedFrom: 'Cement, Sand, Steel, Bricks'
  },
  {
    id: 'act10',
    name: 'Bread & Biscuit Baking',
    icon: 'Cookie',
    description: 'Grinding harvested wheat into flour, mixing with yeast, and baking in ovens into bread and biscuits.',
    sector: 'secondary',
    reason: 'Processes agricultural grain into ready-to-eat packaged bakery goods.',
    transformedFrom: 'Wheat Grain'
  },
  // Tertiary
  {
    id: 'act11',
    name: 'Freight & Passenger Transport',
    icon: 'Truck',
    description: 'Operating trucks, trains, buses, auto-rickshaws, and ships to move goods and people.',
    sector: 'tertiary',
    reason: 'Provides the service of mobility and distribution without creating a physical new substance.',
    serviceBeneficiary: 'Farmers, Factory owners, Passengers'
  },
  {
    id: 'act12',
    name: 'Retail Trade & Shopkeeping',
    icon: 'Store',
    description: 'Purchasing goods from wholesale markets and selling them in convenient quantities to consumers.',
    sector: 'tertiary',
    reason: 'Provides commercial exchange and distribution service between manufacturers and end users.',
    serviceBeneficiary: 'Local residents and consumers'
  },
  {
    id: 'act13',
    name: 'Banking & Financial Services',
    icon: 'Landmark',
    description: 'Safeguarding people’s savings, facilitating money transfers, and providing loans for farming or business.',
    sector: 'tertiary',
    reason: 'Provides financial management and credit services that keep economic transactions smooth.',
    serviceBeneficiary: 'Farmers buying seeds, Traders, Families'
  },
  {
    id: 'act14',
    name: 'Healthcare & Hospitals',
    icon: 'Stethoscope',
    description: 'Providing medical check-ups, nursing care, medicines, and emergency treatments to patients.',
    sector: 'tertiary',
    reason: 'Delivers essential health services that maintain human life, stamina, and productivity.',
    serviceBeneficiary: 'All citizens and workers'
  },
  {
    id: 'act15',
    name: 'Telecommunications & Internet',
    icon: 'PhoneCall',
    description: 'Providing mobile networks, data connectivity, and messaging so people can communicate instantly.',
    sector: 'tertiary',
    reason: 'Provides the service of information transfer and digital communication across distances.',
    serviceBeneficiary: 'Businesses, Schools, Families'
  },
  {
    id: 'act16',
    name: 'Warehousing & Cold Storage',
    icon: 'Boxes',
    description: 'Storing food grains, potatoes, apples, and milk in temperature-controlled warehouses to prevent spoilage.',
    sector: 'tertiary',
    reason: 'Provides preservation and storage services between harvest time and consumption time.',
    serviceBeneficiary: 'Farmers, Food processors, Wholesale traders'
  }
];

export const TRANSFORMATION_PIPELINES: TransformationPipeline[] = [
  {
    id: 'p1',
    title: 'From Cotton Flower to School Shirt',
    productName: 'Cotton Garment / Shirt',
    rawMaterial: {
      name: 'Raw Cotton (Kapas)',
      source: 'Harvested from cotton bolls growing in farm soil under the sun.',
      sector: 'primary',
      icon: 'Wheat',
      details: 'Cotton farmer picks soft white cotton bolls and sells them to ginning mills.'
    },
    processing: {
      name: 'Spinning, Weaving & Tailoring',
      stages: [
        'Ginning: Separating cotton seed from lint',
        'Spinning: Twisting raw fibres into uniform thread/yarn',
        'Weaving: Loom weaving yarn into durable fabric',
        'Dyeing & Tailoring: Cutting cloth and stitching buttons into a shirt'
      ],
      sector: 'secondary',
      icon: 'Factory',
      details: 'Textile factories and tailors transform loose fluffy fibre into wearable stitched garments.'
    },
    product: {
      name: 'Finished Cotton Shirt',
      usage: 'Worn by school students and office workers for comfort and protection.',
      sector: 'secondary',
      icon: 'Shirt',
      details: 'Sold in clothing shops (tertiary) to consumers who wear it every day.'
    },
    keyIdea: 'The secondary sector adds value and utility by transforming natural cotton into comfortable clothing.'
  },
  {
    id: 'p2',
    title: 'From Forest Tree to Wooden Study Desk',
    productName: 'Wooden Study Table',
    rawMaterial: {
      name: 'Timber / Wood Logs',
      source: 'Harvested from plantation or forest trees.',
      sector: 'primary',
      icon: 'Trees',
      details: 'Foresters cut mature timber logs from managed tree plantations.'
    },
    processing: {
      name: 'Sawmilling, Seasoning & Carpentry',
      stages: [
        'Sawing: Cutting round logs into flat planks',
        'Seasoning: Drying wood to prevent bending/cracking',
        'Carpentry: Planing, joining, gluing, and polishing planks into a sturdy desk'
      ],
      sector: 'secondary',
      icon: 'Hammer',
      details: 'Sawmills and carpenters shape raw tree trunks into polished functional furniture.'
    },
    product: {
      name: 'Study Desk with Shelves',
      usage: 'Used in schools and study rooms for reading, writing, and keeping books.',
      sector: 'secondary',
      icon: 'Boxes',
      details: 'Transported to furniture showrooms and delivered to classrooms.'
    },
    keyIdea: 'Without carpentry and processing, a tree trunk cannot be used as a writing surface.'
  },
  {
    id: 'p3',
    title: 'From Underground Iron Ore to Bicycle',
    productName: 'Steel Bicycle',
    rawMaterial: {
      name: 'Iron Ore',
      source: 'Mined from rocky mineral deposits inside the Earth.',
      sector: 'primary',
      icon: 'Mountain',
      details: 'Miners extract reddish-brown iron ore rocks from open-cast mines.'
    },
    processing: {
      name: 'Smelting & Bicycle Manufacturing',
      stages: [
        'Smelting: Melting iron ore in high-heat blast furnace to remove impurities',
        'Steel Making: Adding carbon to make strong steel rods and sheets',
        'Bicycle Assembly: Bending steel tubes into frames, fitting gears, chain, and wheels'
      ],
      sector: 'secondary',
      icon: 'Factory',
      details: 'Industrial steel mills and bicycle factories convert raw red stone into a sleek moving vehicle.'
    },
    product: {
      name: 'Ready-to-Ride Bicycle',
      usage: 'Eco-friendly transport for children going to school and adults commuting.',
      sector: 'secondary',
      icon: 'Bike',
      details: 'Purchased at bicycle dealerships for daily personal transportation.'
    },
    keyIdea: 'Secondary manufacturing turns hard mineral rocks into smooth, high-precision transportation machines.'
  }
];

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: 's1',
    name: 'Transportation Services',
    icon: 'Truck',
    whoUsesIt: 'Farmers sending crops to city, factory owners receiving raw materials, students riding buses.',
    howItHelps: 'Moves people and heavy materials across vast distances quickly and safely.',
    withoutItConsequence: 'Agricultural crops would rot on farms, factory machines would stop without raw material, and shops would be empty.',
    sector: 'tertiary',
    example: 'State transport buses, cargo trucks, Indian Railways goods trains.'
  },
  {
    id: 's2',
    name: 'Trade & Commerce (Markets & Shops)',
    icon: 'Store',
    whoUsesIt: 'Producers looking to sell their goods and families buying groceries, medicines, and books.',
    howItHelps: 'Acts as the bridge between makers of goods and users of goods.',
    withoutItConsequence: 'A consumer would have to travel 500 km to a cotton farm just to buy cloth for a shirt.',
    sector: 'tertiary',
    example: 'Neighbourhood kirana shops, weekly vegetable markets (haats), retail stores.'
  },
  {
    id: 's3',
    name: 'Banking & Financial Services',
    icon: 'Landmark',
    whoUsesIt: 'Farmers buying seeds/tractors on loan, businesses paying workers, families saving for the future.',
    howItHelps: 'Provides safe deposit accounts, quick digital payments (UPI), and loans for productive work.',
    withoutItConsequence: 'Farmers could not buy expensive equipment before harvest, and trade would stall without money flow.',
    sector: 'tertiary',
    example: 'State Bank branches, village cooperative banks, post office savings.'
  },
  {
    id: 's4',
    name: 'Healthcare & Medical Services',
    icon: 'Stethoscope',
    whoUsesIt: 'Every working person, child, and elderly citizen.',
    howItHelps: 'Keeps people healthy, cures diseases, treats injuries, and ensures workers have energy to work.',
    withoutItConsequence: 'Disease outbreaks would disable the workforce, stopping production across farms and factories.',
    sector: 'tertiary',
    example: 'Primary Health Centres (PHCs), district hospitals, ambulance services.'
  },
  {
    id: 's5',
    name: 'Communication & Information',
    icon: 'PhoneCall',
    whoUsesIt: 'Farmers checking mandi crop prices on phones, businesses coordinating orders, families staying in touch.',
    howItHelps: 'Shares critical market information, weather alerts, and orders in seconds.',
    withoutItConsequence: 'Farmers would sell crops at huge losses because they wouldn’t know the fair market prices.',
    sector: 'tertiary',
    example: 'Mobile phones, weather forecast SMS, postal network, internet portals.'
  },
  {
    id: 's6',
    name: 'Storage & Cold Chain Facilities',
    icon: 'Boxes',
    whoUsesIt: 'Dairy farmers, potato & apple growers, grain mandi authorities.',
    howItHelps: 'Stores surplus harvest in clean, chilled rooms so food does not spoil before reaching city tables.',
    withoutItConsequence: 'Perishable milk, fruit, and vegetables would spoil in 24 hours in hot weather.',
    sector: 'tertiary',
    example: 'Cold storage units for apples in Himachal, grain silos of Food Corporation of India.'
  }
];

export const VALUE_CHAINS: ValueChain[] = [
  {
    id: 'vc_shirt',
    productName: 'The Journey of a Cotton T-Shirt',
    icon: 'Shirt',
    description: 'See how a tiny cotton seed planted in black soil transforms into the T-shirt you wear today.',
    stages: [
      {
        stageNumber: 1,
        actor: 'Cotton Farmer (e.g. Ramesh in Maharashtra/Gujarat)',
        sector: 'primary',
        icon: 'Wheat',
        whatHappens: 'Sows cotton seeds, irrigates using canal/rainwater, and harvests soft white cotton bolls.',
        needsFromPrevious: 'Natural soil, sunshine, water, seeds, and organic manure.',
        providesToNext: 'Bales of raw cotton (kapas) packed for transportation.',
        realWorldExample: 'Farmers in Vidarbha and Saurashtra growing cotton.'
      },
      {
        stageNumber: 2,
        actor: 'Truck Driver (Transport Service)',
        sector: 'tertiary',
        icon: 'Truck',
        whatHappens: 'Loads heavy cotton bales onto a truck and drives 200 km to the textile industrial cluster.',
        needsFromPrevious: 'Packed cotton bales from the farmer; diesel fuel and motorable roads.',
        providesToNext: 'On-time delivery of intact raw material to the spinning mill.',
        realWorldExample: 'Highway freight trucks connecting mandis to industrial hubs.'
      },
      {
        stageNumber: 3,
        actor: 'Textile Mill & Garment Factory',
        sector: 'secondary',
        icon: 'Factory',
        whatHappens: 'Gins the cotton, spins thread on spinning frames, weaves cloth, cuts patterns, and stitches the shirt.',
        needsFromPrevious: 'Raw cotton bales delivered by truck, electricity, and skilled workers.',
        providesToNext: 'Finished, ironed, and packaged cotton T-shirts in cardboard boxes.',
        realWorldExample: 'Textile mills in Ahmedabad, Surat, and Coimbatore.'
      },
      {
        stageNumber: 4,
        actor: 'Retail Clothing Merchant',
        sector: 'tertiary',
        icon: 'Store',
        whatHappens: 'Stocks various sizes and colours in the shop, displays them, and sells them to buyers.',
        needsFromPrevious: 'Boxed shirts from the factory and banking credit/cash to maintain stock.',
        providesToNext: 'Convenient shopping, trial rooms, and sales receipts to customers.',
        realWorldExample: 'Garment showroom or local clothing store in your town.'
      },
      {
        stageNumber: 5,
        actor: 'Student / Consumer (You!)',
        sector: 'tertiary', // Consumption
        icon: 'User',
        whatHappens: 'Buys the comfortable cotton shirt to wear to school or play outdoors.',
        needsFromPrevious: 'A quality shirt sold at a fair price with easy payment methods.',
        providesToNext: 'Consumer demand that pays everyone back up the economic chain!',
        realWorldExample: 'You and your friends wearing comfortable clothes.'
      }
    ],
    disruptionScenario: {
      disruptedStageIndex: 1, // Transport strike
      description: 'What if all truck transport stops for 10 days due to a severe fuel shortage or highway blockage?',
      rippleEffect: 'Cotton piles up unsold at farms (farmers lose income), textile mills run out of raw fibre and shut machines, garment stores have empty racks, and consumers cannot buy clothes!',
      lesson: 'This shows INTERDEPENDENCE: No sector can function in isolation. When one link breaks, every sector suffers.'
    }
  },
  {
    id: 'vc_bread',
    productName: 'The Journey of a Loaf of Bread',
    icon: 'Cookie',
    description: 'Trace wheat grain from golden village fields all the way to warm toast on your breakfast plate.',
    stages: [
      {
        stageNumber: 1,
        actor: 'Wheat Farmer (Punjab/Haryana/MP)',
        sector: 'primary',
        icon: 'Wheat',
        whatHappens: 'Grows wheat crop during the Rabi season and threshes golden grains from stalks.',
        needsFromPrevious: 'Fertile soil, tubewell irrigation, winter sunshine, and seeds.',
        providesToNext: 'Sacks of cleaned wheat grains sent to the flour mill.',
        realWorldExample: 'Wheat harvest in Punjab mandis in April.'
      },
      {
        stageNumber: 2,
        actor: 'Flour Mill & Modern Bakery',
        sector: 'secondary',
        icon: 'Factory',
        whatHappens: 'Grinds wheat into fine flour (atta/maida), kneads with water and yeast, and bakes in ovens into bread.',
        needsFromPrevious: 'Clean wheat grain sacks, electricity, baking ovens, and packaging foil.',
        providesToNext: 'Freshly baked, sliced, and sealed loaves of bread.',
        realWorldExample: 'Local bakeries and large food processing plants.'
      },
      {
        stageNumber: 3,
        actor: 'Delivery Van & Grocery Store',
        sector: 'tertiary',
        icon: 'Truck',
        whatHappens: 'Delivers fresh bread crates at 6:00 AM every morning to neighbourhood grocery stores.',
        needsFromPrevious: 'Fresh bread from bakery and refrigerated delivery vans.',
        providesToNext: 'Fresh bread ready for morning neighbourhood shoppers.',
        realWorldExample: 'Daily morning delivery to your local kirana store.'
      },
      {
        stageNumber: 4,
        actor: 'Family Breakfast (Consumer)',
        sector: 'tertiary',
        icon: 'User',
        whatHappens: 'Toasts bread and enjoys a healthy breakfast before going to school and work.',
        needsFromPrevious: 'Fresh, hygienic bread available within walking distance.',
        providesToNext: 'Revenue that flows back to shopkeeper, baker, trucker, and farmer.',
        realWorldExample: 'Your breakfast table with family.'
      }
    ],
    disruptionScenario: {
      disruptedStageIndex: 0, // Severe Drought
      description: 'What if a severe drought destroys 60% of the wheat crop in the primary sector?',
      rippleEffect: 'Wheat prices skyrocket, bakeries cannot get enough flour, bread production drops sharply, prices in grocery shops double, and families struggle to afford daily food!',
      lesson: 'The entire food supply chain rests on the foundation of PRIMARY sector agriculture.'
    }
  }
];

export const AMUL_STAGES: AmulStage[] = [
  {
    step: 1,
    title: 'Village Milk Producers (Dairy Farmers)',
    actor: 'Smallholder Farmers & Cattle Keepers (mostly rural women in Anand, Gujarat)',
    sector: 'primary',
    icon: 'Milk',
    whatHappens: 'Farmers feed cows and buffaloes with green fodder and water, and milk them twice daily at dawn and dusk.',
    equipmentOrTools: 'Clean stainless steel milk pails, cattle sheds, clean drinking water for livestock.',
    connectionToNext: 'Farmers carry fresh milk in cans to their village collection centre within 1 hour of milking.',
    whyCooperativeMatters: 'Before the cooperative, private middlemen paid unfair low prices to poor farmers. Cooperatives gave farmers ownership of their produce.'
  },
  {
    step: 2,
    title: 'Village Milk Collection Centre',
    actor: 'Village Cooperative Secretary & Fat Testers',
    sector: 'primary', // Primary collection & Quality service
    icon: 'ClipboardCheck',
    whatHappens: 'Weighs the milk brought by each farmer, conducts an automated Gerber/electronic fat test, and records the payout instantly.',
    equipmentOrTools: 'Electronic weighing scales, milk fat testing machines, computer ledger.',
    connectionToNext: 'Milk is pooled into insulated bulk milk coolers (BMCs) kept at 4°C to prevent bacterial growth.',
    whyCooperativeMatters: 'Guarantees fair price based on transparent quality testing. Every farmer gets paid cash directly without deductions.'
  },
  {
    step: 3,
    title: 'Refrigerated Tanker Transportation',
    actor: 'Insulated Milk Tanker Drivers',
    sector: 'tertiary',
    icon: 'Truck',
    whatHappens: 'Transports chilled milk in insulated stainless steel tankers from hundreds of villages to the central dairy processing plant.',
    equipmentOrTools: 'Double-walled refrigerated road tankers, temperature loggers, GPS tracking.',
    connectionToNext: 'Delivers fresh chilled raw milk directly into plant holding silos without any temperature rise.',
    whyCooperativeMatters: 'Connects isolated remote village farmers to large urban dairy processing plants across hundreds of kilometres.'
  },
  {
    step: 4,
    title: 'Modern Dairy Processing Plant',
    actor: 'Dairy Engineers, Food Technologists & Plant Workers',
    sector: 'secondary',
    icon: 'Factory',
    whatHappens: 'Pasteurizes milk (heating to 72°C and rapid cooling to kill germs), homogenizes it, and manufactures Butter, Cheese, Ghee, Milk Powder, and Ice Cream.',
    equipmentOrTools: 'Pasteurizers, cream separators, butter churns, sterile pouch-packaging lines.',
    connectionToNext: 'Packs milk into tamper-proof pouches and boxes, transferring them to cold storage dispatch bays.',
    whyCooperativeMatters: 'Transforms perishable liquid milk into high-value products that can be preserved and sold throughout the year.'
  },
  {
    step: 5,
    title: 'Cold-Chain Distribution & Retail Booths',
    actor: 'Wholesale Distributors & Amul Parlour Owners',
    sector: 'tertiary',
    icon: 'Store',
    whatHappens: 'Distributes milk pouches to thousands of retail stores, supermarkets, and dedicated Amul parlours every single morning before 6:00 AM.',
    equipmentOrTools: 'Deep freezers, display chillers, digital billing systems.',
    connectionToNext: 'Sells milk packets, butter, and cheese directly to consumers across India.',
    whyCooperativeMatters: 'Provides consumers with pure, affordable milk while sending the maximum share of consumer rupee back to rural farmers.'
  },
  {
    step: 6,
    title: 'Millions of Consumers Across India',
    actor: 'Urban & Rural Households (You and your family)',
    sector: 'tertiary', // Consumption
    icon: 'Users',
    whatHappens: 'Consumes nutritious milk, curd, butter, and sweets daily, supporting the health of families.',
    equipmentOrTools: 'Kitchen cookware, refrigerators.',
    connectionToNext: 'Payments from consumers flow back through the cooperative system to 3.6+ million farmer-owners.',
    whyCooperativeMatters: 'AMUL demonstrated the White Revolution (Operation Flood), turning India from a milk-deficient nation into the world’s largest milk producer.'
  }
];

export const THINK_PROMPTS: ThinkPrompt[] = [
  {
    id: 'tp1',
    title: 'What If There Were No Transportation in an Economy?',
    question: 'Imagine a city where all transportation (trucks, trains, vans, autos) completely disappears for one month. What would happen to farmers in nearby villages and families living in the city?',
    hint: 'Think about what farmers do with their harvest and how city shops get food items every morning.',
    guidingPoints: [
      'What happens to perishable crops (tomatoes, milk, leafy vegetables) on farms?',
      'Can city residents grow their own food inside apartments?',
      'Can factories run without trucks delivering raw materials?'
    ],
    modelExplanation: 'If transportation stops: 1) Farmers would suffer huge financial losses because perishable crops like milk, fruits, and vegetables would rot on farms without reaching markets. 2) City families would face severe food shortages and rising prices because cities cannot produce their own grain. 3) Factories would shut down due to lack of raw materials. This proves that the Tertiary sector (transportation) is the lifeline connecting Primary production with Consumers.',
    ncertRef: 'NCERT Chapter 14: Let’s Explore — Interdependence of Economic Activities'
  },
  {
    id: 'tp2',
    title: 'Is Cooking Food Always an Economic Activity?',
    question: 'Sunita cooks lunch in a school canteen where she is employed on a monthly salary. Her sister Meena cooks the same lunch at home for her aged parents. Explain why one is an economic activity and the other is not, even though both require the same effort and skill.',
    hint: 'Focus on the definition of economic activity: Does it involve earning a livelihood or monetary exchange?',
    guidingPoints: [
      'Does Sunita receive payment or wages for her canteen work?',
      'Why does Meena cook for her parents?',
      'Does non-economic mean unimportant?'
    ],
    modelExplanation: 'Sunita’s work in the school canteen is an ECONOMIC activity because she receives a salary (livelihood) in exchange for her time and cooking skills. Meena’s work at home is a NON-ECONOMIC activity because it is performed out of love, filial care, and family affection without financial compensation. Note: Non-economic activities are deeply valuable for family well-being, but they are not counted as monetary economic transactions.',
    ncertRef: 'NCERT Chapter 14: Understanding Economic vs Non-Economic Activities'
  },
  {
    id: 'tp3',
    title: 'Why Can’t the Secondary Sector Exist Without the Primary Sector?',
    question: 'A modern textile factory has the world’s most advanced computerized looms and robots. Can this factory produce cloth if all cotton and silk farming stops worldwide? Explain the relationship.',
    hint: 'Where do the raw materials for manufacturing come from?',
    guidingPoints: [
      'What is the input needed by a spinning loom?',
      'Can machines create natural fibres out of thin air?',
      'What is the fundamental role of the Primary sector?'
    ],
    modelExplanation: 'No, the factory cannot produce a single metre of cloth without raw cotton or silk. The Secondary sector only transforms or processes materials; it cannot create the initial natural raw materials. The Primary sector is the foundation that extracts and harvests natural resources. Without agriculture and nature, factories have nothing to process.',
    ncertRef: 'NCERT Chapter 14: Primary and Secondary Sector Relationships'
  },
  {
    id: 'tp4',
    title: 'How Does a Bank Help a Farmer Grow Crops?',
    question: 'A farmer works in the Primary sector (soil, water, crops). A bank works in the Tertiary sector (financial services). How does a bank officer sitting in an office help a farmer harvest wheat 30 kilometres away?',
    hint: 'Think about what a farmer needs to buy before the seeds can even be planted.',
    guidingPoints: [
      'When does a farmer need money vs when does a farmer earn money from harvest?',
      'What expensive inputs (seeds, fertilizer, solar pumps, tractors) are required?',
      'How do loans bridge the time gap between sowing and harvesting?'
    ],
    modelExplanation: 'Farming requires high upfront expenses for quality seeds, organic fertilizers, diesel, and tractor repairs months before the crop is harvested and sold. A bank provides agricultural credit (Kisan Credit Card / loans) at fair interest rates so the farmer can purchase inputs on time. The bank also safely deposits the farmer’s earnings after the harvest. This tertiary service powers primary agricultural production.',
    ncertRef: 'NCERT Chapter 14: Support Services to Agriculture'
  }
];

export const MISCONCEPTIONS: MisconceptionItem[] = [
  {
    id: 'm1',
    statement: 'Only people who work in big factories and corporate offices are engaged in economic activities.',
    isTrue: false,
    explanation: 'A farmer growing wheat, a street vendor selling peanuts, an auto-driver, a potter shaping clay, and a rural tailor are all actively engaged in economic activities because they earn their livelihood by producing goods or providing services.',
    realFact: 'Any human activity carried out to produce goods, render services, or earn a livelihood is an economic activity, regardless of whether it happens on a farm, street, shop, or factory.',
    ncertRef: 'NCERT Chapter 14: Section 1'
  },
  {
    id: 'm2',
    statement: 'Transportation is just moving vehicles; it has nothing to do with the production of goods.',
    isTrue: false,
    explanation: 'Without transportation, raw cotton cannot reach mills, iron ore cannot reach steel plants, and finished food cannot reach consumers. Transportation adds place utility and is an indispensable part of the production and distribution chain.',
    realFact: 'Transportation connects producers to processors and processors to consumers; without it, production would stop.',
    ncertRef: 'NCERT Chapter 14: Sector Interdependence'
  },
  {
    id: 'm3',
    statement: 'The Primary Sector depends only on nature and does not need any support from Secondary or Tertiary sectors.',
    isTrue: false,
    explanation: 'Modern farmers need tractors, pipes, and tools made by factories (Secondary sector) and rely on banks for loans, meteorological departments for weather forecasts, and trucks for transporting produce (Tertiary sector).',
    realFact: 'All three sectors are mutually dependent. Primary sector productivity relies heavily on manufactured tools and tertiary services.',
    ncertRef: 'NCERT Chapter 14: Interdependence of Sectors'
  },
  {
    id: 'm4',
    statement: 'Services are intangible, which means they do not create real economic value.',
    isTrue: false,
    explanation: 'Services like healthcare, teaching, software, electrical repairs, and banking are essential for life and economy. In fact, services make up the largest portion of modern economic value and employ millions of people.',
    realFact: 'Services fulfill essential human needs and enable all physical goods to be manufactured, transported, and sold.',
    ncertRef: 'NCERT Chapter 14: Goods and Services'
  },
  {
    id: 'm5',
    statement: 'Mining and quarrying are part of the Secondary sector because heavy machinery is used.',
    isTrue: false,
    explanation: 'Mining extracts natural mineral ores directly from the Earth’s crust. Because it directly extracts raw resources from nature without converting them into a new manufactured product, it is classified as a PRIMARY activity.',
    realFact: 'The extraction of natural resources (even with heavy excavators) is Primary. Transforming that mined ore into steel or aluminium is Secondary.',
    ncertRef: 'NCERT Chapter 14: Primary Sector Definition'
  },
  {
    id: 'm6',
    statement: 'Non-economic activities are useless and waste time.',
    isTrue: false,
    explanation: 'Non-economic activities—such as parents caring for children, helping an injured neighbour, or keeping our homes clean—build healthy families, strong communities, and ethical values. They are essential for human happiness and society.',
    realFact: 'Non-economic activities are the emotional and social foundation of human society, even though they are not priced in money.',
    ncertRef: 'NCERT Chapter 14: Economic vs Non-Economic Values'
  }
];

export const CONCEPT_MAP_NODES: ConceptNode[] = [
  {
    id: 'node_economic_activities',
    label: 'Economic Activities',
    shortDesc: 'Activities done to earn a livelihood & produce goods/services',
    definition: 'Human actions undertaken to produce, process, distribute, or provide goods and services in exchange for money, wages, or livelihood.',
    example: 'Farming, manufacturing, doctor consultation, driving buses, running grocery shops.',
    connectedNodeIds: ['node_primary', 'node_secondary', 'node_tertiary', 'node_goods', 'node_services', 'node_interdependence'],
    quickCheck: {
      question: 'Which of the following is an economic activity?',
      options: [
        'Singing in the bathroom for personal joy',
        'A carpenter making chairs to sell in his shop',
        'Sleeping on a Sunday afternoon',
        'Watering your home rose plant as a hobby'
      ],
      correctIndex: 1,
      explanation: 'Making chairs to sell in a shop earns a livelihood and produces goods, making it an economic activity.'
    }
  },
  {
    id: 'node_primary',
    label: 'Primary Sector 🌱',
    sector: 'primary',
    shortDesc: 'Direct extraction & use of natural resources',
    definition: 'Activities that depend directly on the bounty of nature (soil, water, forests, mineral deposits, living animals).',
    example: 'Agriculture, Fishing, Forestry, Mining, Quarrying, Animal Husbandry.',
    connectedNodeIds: ['node_economic_activities', 'node_secondary', 'node_goods'],
    quickCheck: {
      question: 'Why is catching fish in a river classified under the Primary Sector?',
      options: [
        'Because fish are sold in city markets',
        'Because it extracts a living food resource directly from nature',
        'Because boats are made of wood',
        'Because fish swim in water'
      ],
      correctIndex: 1,
      explanation: 'Directly harvesting biological resources from natural water bodies is a hallmark of the primary sector.'
    }
  },
  {
    id: 'node_secondary',
    label: 'Secondary Sector 🏭',
    sector: 'secondary',
    shortDesc: 'Processing & transforming raw materials into goods',
    definition: 'Activities where natural raw materials are manufactured, refined, fabricated, or assembled into new finished or semi-finished products.',
    example: 'Spinning cotton into cloth, turning sugarcane into sugar, smelting iron into steel, constructing buildings.',
    connectedNodeIds: ['node_economic_activities', 'node_primary', 'node_tertiary', 'node_goods'],
    quickCheck: {
      question: 'Which of these belongs to the Secondary Sector?',
      options: [
        'Harvesting sugarcane from a field',
        'Crushing sugarcane and making jaggery/sugar in a mill',
        'Transporting sugar bags in a truck',
        'Selling sugar packets in a kirana store'
      ],
      correctIndex: 1,
      explanation: 'Processing sugarcane into sugar transforms the raw agricultural crop into a finished product.'
    }
  },
  {
    id: 'node_tertiary',
    label: 'Tertiary Sector 🧑‍💼',
    sector: 'tertiary',
    shortDesc: 'Providing services that support people & production',
    definition: 'Activities that do not produce physical goods directly, but provide essential support, facilitation, distribution, and care to other sectors and society.',
    example: 'Transportation, Retail Trade, Banking, Healthcare, Education, Telecommunications, Warehousing.',
    connectedNodeIds: ['node_economic_activities', 'node_secondary', 'node_services', 'node_interdependence'],
    quickCheck: {
      question: 'What is the primary role of the Tertiary Sector?',
      options: [
        'To dig minerals from the Earth',
        'To manufacture cars in a factory',
        'To provide services and support to producers and consumers',
        'To grow wheat crops in fields'
      ],
      correctIndex: 2,
      explanation: 'The tertiary sector provides vital support services like transport, trade, healthcare, and finance.'
    }
  },
  {
    id: 'node_goods',
    label: 'Goods 📦',
    shortDesc: 'Physical, tangible items that can be touched and stored',
    definition: 'Material items produced through primary or secondary activities that can be seen, touched, stored, bought, and sold.',
    example: 'A bag of wheat, a cotton shirt, a notebook, a bicycle, earthen pots.',
    connectedNodeIds: ['node_economic_activities', 'node_primary', 'node_secondary'],
    quickCheck: {
      question: 'Which of the following is a physical GOOD?',
      options: [
        'A bus ride from home to school',
        'A medical health checkup by a doctor',
        'A pair of leather school shoes',
        'A mobile phone network connection'
      ],
      correctIndex: 2,
      explanation: 'Shoes are physical, tangible items that you can touch, store, and wear (goods).'
    }
  },
  {
    id: 'node_services',
    label: 'Services 🤝',
    shortDesc: 'Intangible activities performed to meet human needs',
    definition: 'Non-physical actions, skills, or expertise provided by individuals or organizations to help, treat, educate, transport, or assist others.',
    example: 'Teaching students, treating patients, repairing a fan, driving a taxi, banking advice.',
    connectedNodeIds: ['node_economic_activities', 'node_tertiary'],
    quickCheck: {
      question: 'Which of the following is a SERVICE?',
      options: [
        'A wooden pencil',
        'A haircut at a barber shop',
        'A glass of fresh milk',
        'A brick used for building a wall'
      ],
      correctIndex: 1,
      explanation: 'A haircut is a skilled personal care service performed by a barber.'
    }
  },
  {
    id: 'node_interdependence',
    label: 'Sector Interdependence 🔗',
    shortDesc: 'How all three sectors connect like links in a chain',
    definition: 'The mutual reliance of primary, secondary, and tertiary sectors on each other. If one sector experiences disruption, all other sectors and consumers feel the impact.',
    example: 'Cotton farmer (Primary) ➔ Mill weaver (Secondary) ➔ Trucker & Merchant (Tertiary) ➔ Consumer.',
    connectedNodeIds: ['node_primary', 'node_secondary', 'node_tertiary', 'node_economic_activities'],
    quickCheck: {
      question: 'If truck drivers go on strike, which sector is directly affected?',
      options: [
        'Only truck drivers themselves',
        'Only secondary factories',
        'Primary farmers, secondary factories, and tertiary shopkeepers and consumers',
        'Nobody is affected'
      ],
      correctIndex: 2,
      explanation: 'Because of sector interdependence, a transport breakdown affects raw material supply, factory operations, shop inventory, and consumers.'
    }
  }
];
