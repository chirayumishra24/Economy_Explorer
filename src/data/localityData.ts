import { LocalityShop } from '../types/economy';

export const LOCALITY_SHOPS: LocalityShop[] = [
  {
    id: 'loc_kirana',
    name: 'Gupta General & Kirana Store',
    category: 'Daily Groceries & Essentials',
    icon: 'Store',
    proprietor: 'Mr. Rajesh Gupta',
    whatIsProvided: 'Packaged food, grains, salt, cooking oil, spices, soaps, and notebooks.',
    outputType: 'service', // Retail trade service distributing goods
    sector: 'tertiary',
    keyInputsNeeded: [
      'Supplies from wholesale mandi & distributors (Secondary/Tertiary)',
      'Electricity for lights and weighing scale',
      'Shelving units and storage space',
      'Commercial shop license & working capital'
    ],
    interconnectedSectors: 'Primary (farmers who grew the rice/wheat) + Secondary (mills that packed the flour/soap) + Tertiary (trucks that delivered stock).',
    description: 'A neighbourhood retail store that makes everyday household goods easily accessible without travelling to wholesale markets.'
  },
  {
    id: 'loc_veg',
    name: 'Shankar Vegetable & Fruit Cart',
    category: 'Fresh Produce Vendor',
    icon: 'Apple',
    proprietor: 'Shankar Lal',
    whatIsProvided: 'Fresh seasonal vegetables (potatoes, onions, spinach, tomatoes) and seasonal fruits.',
    outputType: 'service', // Retail trade / distribution of agricultural goods
    sector: 'tertiary',
    keyInputsNeeded: [
      'Fresh produce purchased early morning from agricultural mandi (Primary)',
      'Handcart / pushcart on wheels',
      'Weighing scales and jute sacks',
      'Clean water to keep leafy greens fresh'
    ],
    interconnectedSectors: 'Directly linked to Primary farmers who harvested the crops and Tertiary auto/tempo drivers who brought produce to the city mandi.',
    description: 'Brings fresh agricultural produce directly to residential doorsteps every morning.'
  },
  {
    id: 'loc_tailor',
    name: 'Star Master Stitching & Tailoring',
    category: 'Garment Making & Alteration',
    icon: 'Scissors',
    proprietor: 'Mohammed Aslam',
    whatIsProvided: 'Custom-stitched school uniforms, kurtas, suits, and cloth alterations.',
    outputType: 'good', // Produces custom garments (Secondary) + service of alteration
    sector: 'secondary',
    keyInputsNeeded: [
      'Woven cotton/synthetic fabric rolls (Secondary)',
      'Sewing machine, needles, threads, buttons, and measuring tape',
      'Electricity / foot-pedal mechanical energy',
      'Ironing press for finishing'
    ],
    interconnectedSectors: 'Takes manufactured cloth (Secondary) made from raw cotton (Primary) and transforms it into custom clothing.',
    description: 'Transforms flat fabric into fitted garments tailored to individual customer measurements.'
  },
  {
    id: 'loc_repair',
    name: 'Pawan Bicycle & Appliance Repair',
    category: 'Repair & Maintenance Workshop',
    icon: 'Wrench',
    proprietor: 'Pawan Kumar',
    whatIsProvided: 'Bicycle puncture fixing, chain lubrication, brake adjustment, and ceiling fan servicing.',
    outputType: 'service',
    sector: 'tertiary',
    keyInputsNeeded: [
      'Spare parts (tyres, tubes, ball bearings, grease, wires)',
      'Wrench set, screwdriver, tyre levers, air pressure pump',
      'Technical mechanical repair skills'
    ],
    interconnectedSectors: 'Relies on manufactured tools and spare parts (Secondary) to maintain vehicles and machines used in all sectors.',
    description: 'Provides essential maintenance services extending the lifespan of bicycles and household machines.'
  },
  {
    id: 'loc_salon',
    name: 'Classic Hair Styling & Salon',
    category: 'Personal Care & Grooming',
    icon: 'Sparkles',
    proprietor: 'Deepak Sen',
    whatIsProvided: 'Haircuts, hair styling, shaving, and grooming services.',
    outputType: 'service',
    sector: 'tertiary',
    keyInputsNeeded: [
      'Scissors, combs, electric hair trimmers, mirrors, chairs',
      'Sanitizing lotions, shampoos, and clean towels',
      'Electricity and running water'
    ],
    interconnectedSectors: 'Uses manufactured grooming products (Secondary) to deliver skilled personal care services to community members.',
    description: 'Delivers personal grooming services to help residents stay neat and presentable.'
  },
  {
    id: 'loc_clinic',
    name: 'Sanjeevani Community Health Clinic',
    category: 'Primary Healthcare',
    icon: 'Stethoscope',
    proprietor: 'Dr. Anand Verma (MBBS)',
    whatIsProvided: 'Medical diagnosis, fever treatment, blood pressure checks, vaccinations, and first aid.',
    outputType: 'service',
    sector: 'tertiary',
    keyInputsNeeded: [
      'Medicines, syringes, bandages, and thermometers (Secondary)',
      'Diagnostic equipment (stethoscope, BP monitor)',
      'Sterilized clinic rooms and electricity',
      'Medical degree, nursing assistants, and medical knowledge'
    ],
    interconnectedSectors: 'Relies on pharmaceutical factories (Secondary) to keep the community healthy and ready to work across all economic sectors.',
    description: 'Provides affordable, frontline medical care keeping community workers and children healthy.'
  },
  {
    id: 'loc_bank',
    name: 'Gramin Seva Bank Branch & ATM',
    category: 'Banking & Financial Inclusion',
    icon: 'Landmark',
    proprietor: 'Branch Manager Sunita Roy',
    whatIsProvided: 'Savings accounts, fixed deposits, ATM cash withdrawals, UPI payments, and agricultural/business loans.',
    outputType: 'service',
    sector: 'tertiary',
    keyInputsNeeded: [
      'Computer systems, secure servers, and internet connectivity',
      'ATM machines and paper passbooks',
      'Trained bank clerks and security personnel',
      'Regulatory license from Reserve Bank of India (RBI)'
    ],
    interconnectedSectors: 'Finances local farmers (Primary) to buy seeds and shopkeepers (Tertiary) to maintain inventory.',
    description: 'Safe custodian of community savings and provider of credit powering local enterprise.'
  },
  {
    id: 'loc_school',
    name: 'Navodaya Vidya Mandir (School)',
    category: 'Education & Mentorship',
    icon: 'GraduationCap',
    proprietor: 'Principal Mrs. Kulkarni',
    whatIsProvided: 'Quality education from Grade 1 to 10, science labs, sports coaching, and midday meals.',
    outputType: 'service',
    sector: 'tertiary',
    keyInputsNeeded: [
      'School building, benches, blackboards, and books (Secondary)',
      'Trained teachers and educational staff',
      'Food grains for midday meal (Primary)',
      'Electricity and drinking water'
    ],
    interconnectedSectors: 'Educates the future generation of farmers, engineers, doctors, and entrepreneurs who will lead the economy.',
    description: 'Nurtures human intellect, values, and vocational skills essential for long-term economic development.'
  }
];

export interface LocalityActivityRow {
  id: string;
  activityName: string;
  goodOrService: 'Good' | 'Service';
  sector: 'Primary' | 'Secondary' | 'Tertiary';
  keyInput: string;
  explanation: string;
}

export const LOCALITY_PRACTICE_ROWS: LocalityActivityRow[] = [
  {
    id: 'row1',
    activityName: 'Tailor stitching a school uniform',
    goodOrService: 'Good',
    sector: 'Secondary',
    keyInput: 'Cloth, thread, sewing machine, electricity',
    explanation: 'Transforms cloth into finished clothing; produces a tangible physical good.'
  },
  {
    id: 'row2',
    activityName: 'Auto-rickshaw driver dropping passengers at railway station',
    goodOrService: 'Service',
    sector: 'Tertiary',
    keyInput: 'Auto-rickshaw, CNG fuel/battery, driving license',
    explanation: 'Provides transportation service; does not manufacture a new physical item.'
  },
  {
    id: 'row3',
    activityName: 'Vegetable farmer harvesting fresh spinach and carrots',
    goodOrService: 'Good',
    sector: 'Primary',
    keyInput: 'Soil, water, seeds, sunlight, organic fertilizer',
    explanation: 'Extracts natural biological produce directly from the soil.'
  },
  {
    id: 'row4',
    activityName: 'Barber giving a student a haircut before school reopening',
    goodOrService: 'Service',
    sector: 'Tertiary',
    keyInput: 'Scissors, combs, mirror, chair, disinfectant',
    explanation: 'Performs personal grooming service meeting personal care needs.'
  },
  {
    id: 'row5',
    activityName: 'Potter shaping and baking clay water pots (matkas)',
    goodOrService: 'Good',
    sector: 'Secondary',
    keyInput: 'Natural clay, potter wheel, firewood kiln',
    explanation: 'Processes natural raw clay into finished household cooling pots.'
  },
  {
    id: 'row6',
    activityName: 'Bank teller depositing cash into a farmer savings account',
    goodOrService: 'Service',
    sector: 'Tertiary',
    keyInput: 'Computer, banking software, passbook printer, internet',
    explanation: 'Provides safe financial management and transaction service.'
  }
];
