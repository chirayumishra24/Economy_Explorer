import { Question } from '../types/economy';

export const QUESTIONS: Question[] = [
  // =========================================================================
  // CONCEPT 1: SECTORS (Primary, Secondary, Tertiary)
  // =========================================================================
  {
    id: 'sec-01',
    concept: 'sectors',
    difficulty: 1,
    format: 'identify-role',
    prompt: 'Ramesh harvests wheat grains from his field. Which economic sector is this?',
    options: [
      { id: 'a', text: 'Primary sector, because he draws directly from natural soil and rain.' },
      { id: 'b', text: 'Secondary sector, because he uses hand sickles.' },
      { id: 'c', text: 'Tertiary sector, because he sells wheat to friends.' }
    ],
    answer: 'a',
    explanation: 'Primary activities draw resources directly from nature, such as farming, fishing, and forestry.',
    objective: 'Classify real-life activity as primary and give a clear reason.',
    source: 'unverified'
  },
  {
    id: 'sec-02',
    concept: 'sectors',
    difficulty: 1,
    format: 'identify-role',
    prompt: 'A baker mixes flour, yeast, and water to bake fresh loaves of bread. Which sector does this belong to?',
    options: [
      { id: 'a', text: 'Primary sector, because wheat comes from nature.' },
      { id: 'b', text: 'Secondary sector, because raw flour is turned into a newly made good.' },
      { id: 'c', text: 'Tertiary sector, because baking provides a food service.' }
    ],
    answer: 'b',
    explanation: 'Secondary activities take raw materials and manufacture or transform them into made goods.',
    objective: 'Classify real-life activity as secondary and give a clear reason.',
    source: 'unverified'
  },
  {
    id: 'sec-03',
    concept: 'sectors',
    difficulty: 1,
    format: 'identify-role',
    prompt: 'Sunita drives a school bus carrying students safely to school every morning. Which sector is this?',
    options: [
      { id: 'a', text: 'Primary sector, because buses travel outdoors.' },
      { id: 'b', text: 'Secondary sector, because bus factories build vehicles.' },
      { id: 'c', text: 'Tertiary sector, because driving transport is a supportive service.' }
    ],
    answer: 'c',
    explanation: 'Transport does not produce a physical object; it provides a valuable supportive service.',
    objective: 'Classify real-life activity as tertiary and give a clear reason.',
    source: 'unverified'
  },
  {
    id: 'sec-04',
    concept: 'sectors',
    difficulty: 2,
    format: 'connection-reasoning',
    prompt: 'Why is catching fish in a river considered a primary economic activity?',
    options: [
      { id: 'a', text: 'Because fishermen must drive large refrigerated vans.' },
      { id: 'b', text: 'Because it relies directly on natural water bodies and fish breeding in nature.' },
      { id: 'c', text: 'Because fish is cooked into curry in a restaurant.' }
    ],
    answer: 'b',
    explanation: 'Activities that gather or extract food and materials directly from nature belong to the primary sector.',
    objective: 'Classify real-life activity as primary and give a clear reason.',
    source: 'unverified'
  },
  {
    id: 'sec-05',
    concept: 'sectors',
    difficulty: 2,
    format: 'scenario',
    prompt: 'A potter takes wet clay from a riverbank and shapes it on a wheel into clay pots. How do the sectors connect here?',
    options: [
      { id: 'a', text: 'Clay is a primary natural material, while shaping pots on the wheel is secondary manufacturing.' },
      { id: 'b', text: 'Both digging clay and shaping pots are tertiary services.' },
      { id: 'c', text: 'Clay is made in a factory, so all of it is secondary.' }
    ],
    answer: 'a',
    explanation: 'Gathering clay comes from nature (primary), and transforming that clay into a pot is manufacturing (secondary).',
    objective: 'Trace connection between primary raw materials and secondary making.',
    source: 'unverified'
  },
  {
    id: 'sec-06',
    concept: 'sectors',
    difficulty: 3,
    format: 'cause-effect',
    prompt: 'A doctor examines a patient in a village health clinic. Why is healthcare classified as tertiary rather than secondary?',
    options: [
      { id: 'a', text: 'Because doctors do not manufacture physical goods; they provide skilled care and service.' },
      { id: 'b', text: 'Because medicines are grown in botanical gardens.' },
      { id: 'c', text: 'Because doctors only work in buildings made of brick.' }
    ],
    answer: 'a',
    explanation: 'Tertiary activities provide assistance, expertise, and support services rather than creating physical products.',
    objective: 'Classify real-life activity as tertiary and give a clear reason.',
    source: 'unverified'
  },
  {
    id: 'sec-07',
    concept: 'sectors',
    difficulty: 3,
    format: 'predict-next',
    prompt: 'If a village only had farms (primary) and shops (tertiary), which sector is missing to turn cotton into shirts?',
    options: [
      { id: 'a', text: 'The secondary sector, because spinning and weaving require processing factories or workshops.' },
      { id: 'b', text: 'The primary sector, because we need more soil.' },
      { id: 'c', text: 'No sector is missing; shops can directly grow cotton on shelves.' }
    ],
    answer: 'a',
    explanation: 'Without the secondary sector, raw materials cannot be transformed into usable manufactured items.',
    objective: 'Classify real-life activity as secondary and give a clear reason.',
    source: 'unverified'
  },

  // =========================================================================
  // CONCEPT 2: GOODS VS SERVICES
  // =========================================================================
  {
    id: 'gvs-01',
    concept: 'goods-services',
    difficulty: 1,
    format: 'scenario',
    prompt: 'Which of the following is an example of a physical GOOD rather than a service?',
    options: [
      { id: 'a', text: 'A sturdy wooden chair crafted by a carpenter.' },
      { id: 'b', text: 'A teacher explaining a lesson on history.' },
      { id: 'c', text: 'A mechanic repairing a flat bicycle tyre.' }
    ],
    answer: 'a',
    explanation: 'A good is a tangible physical object you can touch, store, and take home.',
    objective: 'Distinguish between goods and services.',
    source: 'unverified'
  },
  {
    id: 'gvs-02',
    concept: 'goods-services',
    difficulty: 1,
    format: 'identify-role',
    prompt: 'When a barber cuts your hair, what are they providing?',
    options: [
      { id: 'a', text: 'A manufactured good that you put in your pocket.' },
      { id: 'b', text: 'A skilled personal service that helps you.' },
      { id: 'c', text: 'A natural raw material gathered from fields.' }
    ],
    answer: 'b',
    explanation: 'Haircutting is a service because it is an action or work performed for someone, not a tangible product.',
    objective: 'Distinguish between goods and services.',
    source: 'unverified'
  },
  {
    id: 'gvs-03',
    concept: 'goods-services',
    difficulty: 2,
    format: 'connection-reasoning',
    prompt: 'Why does an electrician provide a SERVICE rather than a good?',
    options: [
      { id: 'a', text: 'Because fixing household wiring is skilled helpful work, not a manufactured object.' },
      { id: 'b', text: 'Because wires come directly from wild forest trees.' },
      { id: 'c', text: 'Because electricity cannot be bought or sold in an economy.' }
    ],
    answer: 'a',
    explanation: 'Services are activities and tasks performed by people using their knowledge, skills, or labour.',
    objective: 'Distinguish between goods and services.',
    source: 'unverified'
  },
  {
    id: 'gvs-04',
    concept: 'goods-services',
    difficulty: 2,
    format: 'scenario',
    prompt: 'Meera buys a textbook at a bookshop. In this single visit, what is the good and what is the service?',
    options: [
      { id: 'a', text: 'The printed textbook is the good; the shopkeeper stocking and selling it is the service.' },
      { id: 'b', text: 'The book is a service; reading is a primary activity.' },
      { id: 'c', text: 'Both the book and the shop are natural raw materials.' }
    ],
    answer: 'a',
    explanation: 'The physical book is a manufactured good, while retailing and distributing it is a tertiary service.',
    objective: 'Distinguish between goods and services.',
    source: 'unverified'
  },
  {
    id: 'gvs-05',
    concept: 'goods-services',
    difficulty: 2,
    format: 'identify-role',
    prompt: 'Which pair consists of ONE good and ONE service?',
    options: [
      { id: 'a', text: 'A bottle of milk and a bus ride home.' },
      { id: 'b', text: 'A shirt and a wooden desk.' },
      { id: 'c', text: 'Teaching a class and driving a truck.' }
    ],
    answer: 'a',
    explanation: 'Milk is a physical good, while a bus ride is a transport service.',
    objective: 'Distinguish between goods and services.',
    source: 'unverified'
  },
  {
    id: 'gvs-06',
    concept: 'goods-services',
    difficulty: 3,
    format: 'cause-effect',
    prompt: 'Can a person produce BOTH a good and a service in their daily work?',
    options: [
      { id: 'a', text: 'Yes, a tailor makes a physical shirt (good) and also provides custom fitting (service).' },
      { id: 'b', text: 'No, people are strictly allowed to do only one kind of activity.' },
      { id: 'c', text: 'No, services are only done by computers and machines.' }
    ],
    answer: 'a',
    explanation: 'Many craftspeople and businesses combine creating physical goods with custom services.',
    objective: 'Distinguish between goods and services.',
    source: 'unverified'
  },
  {
    id: 'gvs-07',
    concept: 'goods-services',
    difficulty: 3,
    format: 'predict-next',
    prompt: 'If postal and mobile services shut down, which group of workers is directly disrupted?',
    options: [
      { id: 'a', text: 'Communication workers who provide tertiary connectivity services.' },
      { id: 'b', text: 'Cows grazing in the dairy farm.' },
      { id: 'c', text: 'Only forest timber trees.' }
    ],
    answer: 'a',
    explanation: 'Postal and telecom workers provide essential tertiary services that connect economic actors.',
    objective: 'Distinguish between goods and services.',
    source: 'unverified'
  },

  // =========================================================================
  // CONCEPT 3: ROLES (Producer, Seller, Consumer)
  // =========================================================================
  {
    id: 'rol-01',
    concept: 'roles',
    difficulty: 1,
    format: 'identify-role',
    prompt: 'What does a PRODUCER do in an economy?',
    options: [
      { id: 'a', text: 'Grows crops or manufactures goods from materials.' },
      { id: 'b', text: 'Only eats or uses products at home.' },
      { id: 'c', text: 'Stops other people from doing work.' }
    ],
    answer: 'a',
    explanation: 'A producer is someone who makes, grows, or supplies goods and services for others.',
    objective: 'Say what a producer, a seller and a consumer each do.',
    source: 'unverified'
  },
  {
    id: 'rol-02',
    concept: 'roles',
    difficulty: 1,
    format: 'identify-role',
    prompt: 'What is the main role of a SELLER or TRADER?',
    options: [
      { id: 'a', text: 'Connects producers with buyers by offering goods in a market.' },
      { id: 'b', text: 'Mines ores deep inside the earth.' },
      { id: 'c', text: 'Only uses products without ever offering them to anyone.' }
    ],
    answer: 'a',
    explanation: 'A seller brings goods from makers to a marketplace where people can purchase them.',
    objective: 'Say what a producer, a seller and a consumer each do.',
    source: 'unverified'
  },
  {
    id: 'rol-03',
    concept: 'roles',
    difficulty: 1,
    format: 'identify-role',
    prompt: 'Who is a CONSUMER in an economic activity?',
    options: [
      { id: 'a', text: 'The person who buys and uses a good or service to satisfy a need.' },
      { id: 'b', text: 'The person who only drives a cargo vehicle.' },
      { id: 'c', text: 'The machine that spins cotton inside a mill.' }
    ],
    answer: 'a',
    explanation: 'A consumer is the person at the end of the chain who uses the good or service.',
    objective: 'Say what a producer, a seller and a consumer each do.',
    source: 'unverified'
  },
  {
    id: 'rol-04',
    concept: 'roles',
    difficulty: 2,
    format: 'scenario',
    prompt: 'Farmer Sunita drinks milk from her own dairy cows. In this moment, Sunita is acting as both:',
    options: [
      { id: 'a', text: 'A producer (who collected the milk) and a consumer (who drinks it).' },
      { id: 'b', text: 'A truck driver and a banker.' },
      { id: 'c', text: 'A factory machine and a retail store.' }
    ],
    answer: 'a',
    explanation: 'When someone produces a good and consumes it themselves, they play both economic roles.',
    objective: 'Say what a producer, a seller and a consumer each do.',
    source: 'unverified'
  },
  {
    id: 'rol-05',
    concept: 'roles',
    difficulty: 2,
    format: 'connection-reasoning',
    prompt: 'Why do producers need markets to meet consumers?',
    options: [
      { id: 'a', text: 'Because farmers and factory workers cannot travel to every individual family home.' },
      { id: 'b', text: 'Because goods are not allowed to be used by anyone.' },
      { id: 'c', text: 'Because markets only exist for playing games.' }
    ],
    answer: 'a',
    explanation: 'Markets serve as central meeting points where sellers display goods for many consumers to find easily.',
    objective: 'Say what a producer, a seller and a consumer each do.',
    source: 'unverified'
  },
  {
    id: 'rol-06',
    concept: 'roles',
    difficulty: 3,
    format: 'cause-effect',
    prompt: 'A weaver buys thread from a mill to make shawls, then sells them to a shop. What roles does the weaver play?',
    options: [
      { id: 'a', text: 'Consumer of thread, producer of shawls, and seller to the shop.' },
      { id: 'b', text: 'Only a consumer who never creates anything.' },
      { id: 'c', text: 'Only a farmer harvesting wild crops.' }
    ],
    answer: 'a',
    explanation: 'Economic roles change depending on the transaction: buying raw materials makes one a buyer/consumer, and crafting shawls makes one a producer.',
    objective: 'Say what a producer, a seller and a consumer each do.',
    source: 'unverified'
  },
  {
    id: 'rol-07',
    concept: 'roles',
    difficulty: 3,
    format: 'predict-next',
    prompt: 'What is the key purpose of people engaging in economic activities like farming, manufacturing, or teaching?',
    options: [
      { id: 'a', text: 'To earn an income or livelihood and meet their daily family needs.' },
      { id: 'b', text: 'To ensure products stay locked away forever.' },
      { id: 'c', text: 'Only to pass time without any economic purpose.' }
    ],
    answer: 'a',
    explanation: 'People work in economic activities to earn a living, support their families, and contribute goods and services.',
    objective: 'Say what a producer, a seller and a consumer each do.',
    source: 'unverified'
  },

  // =========================================================================
  // CONCEPT 4: VALUE CHAINS (Product Journeys)
  // =========================================================================
  {
    id: 'chn-01',
    concept: 'chain',
    difficulty: 1,
    format: 'journey-order',
    prompt: 'What is the correct 3-stage journey to produce a loaf of bread?',
    options: [
      { id: 'a', text: 'Wheat farm (nature) → Flour mill & bakery (making) → Grocery shop (market).' },
      { id: 'b', text: 'Grocery shop → Wheat farm → Bakery oven.' },
      { id: 'c', text: 'Bakery oven → Wheat seed planting → Flour milling.' }
    ],
    answer: 'a',
    explanation: 'A product journey flows from raw harvest, through manufacturing/baking, to the retail market.',
    objective: 'Trace one product from raw material to consumer, naming at least three stages in order.',
    source: 'unverified'
  },
  {
    id: 'chn-02',
    concept: 'chain',
    difficulty: 1,
    format: 'sequence',
    prompt: 'In the journey of a cotton shirt, which stage happens FIRST?',
    options: [
      { id: 'a', text: 'Farmer picks raw cotton pods from plants in the field.' },
      { id: 'b', text: 'Shopkeeper hangs the shirt on a coat rack.' },
      { id: 'c', text: 'Buyer wears the shirt to school.' }
    ],
    answer: 'a',
    explanation: 'Every manufactured product begins with the primary harvest of raw materials from nature.',
    objective: 'Trace one product from raw material to consumer, naming at least three stages in order.',
    source: 'unverified'
  },
  {
    id: 'chn-03',
    concept: 'chain',
    difficulty: 2,
    format: 'journey-order',
    prompt: 'Which order correctly traces fresh milk from the cow to your kitchen table?',
    options: [
      { id: 'a', text: 'Dairy farm milking → Dairy plant pasteurizing → Bazaar shop → Kitchen.' },
      { id: 'b', text: 'Bazaar shop → Cow milking → Dairy plant pasteurizing.' },
      { id: 'c', text: 'Kitchen → Dairy plant → Cow milking.' }
    ],
    answer: 'a',
    explanation: 'Milk is collected at the farm, processed and sealed at the plant, stocked at the bazaar, and consumed at home.',
    objective: 'Trace one product from raw material to consumer, naming at least three stages in order.',
    source: 'unverified'
  },
  {
    id: 'chn-04',
    concept: 'chain',
    difficulty: 2,
    format: 'predict-next',
    prompt: 'After timber logs are cut from the forest and driven to the carpenter, what is the NEXT step?',
    options: [
      { id: 'a', text: 'The carpenter cuts and smoothes the wood into school desks.' },
      { id: 'b', text: 'Students write exams on the uncut tree trunk.' },
      { id: 'c', text: 'The logs are shipped back to be replanted in soil.' }
    ],
    answer: 'a',
    explanation: 'Raw logs must be crafted and assembled into finished furniture in the secondary workshop stage.',
    objective: 'Trace one product from raw material to consumer, naming at least three stages in order.',
    source: 'unverified'
  },
  {
    id: 'chn-05',
    concept: 'chain',
    difficulty: 2,
    format: 'connection-reasoning',
    prompt: 'Why does transport appear between almost every stage of a product journey?',
    options: [
      { id: 'a', text: 'Because farms, factories, and bazaar shops are in different physical locations.' },
      { id: 'b', text: 'Because trucks are required to grow cotton plants.' },
      { id: 'c', text: 'Because goods are never allowed to stay stationary.' }
    ],
    answer: 'a',
    explanation: 'Farms are located in rural areas, mills in industrial clusters, and shops near towns. Transport links them together.',
    objective: 'Trace one product from raw material to consumer, naming at least three stages in order.',
    source: 'unverified'
  },
  {
    id: 'chn-06',
    concept: 'chain',
    difficulty: 3,
    format: 'sequence',
    prompt: 'Rearrange these 4 stages of a textbook: (1) Paper mill makes paper from pulp, (2) Student reads textbook, (3) Forest workers harvest wood, (4) Printing press prints book pages.',
    options: [
      { id: 'a', text: '3 (Wood harvest) → 1 (Paper mill) → 4 (Printing press) → 2 (Student reading).' },
      { id: 'b', text: '2 → 4 → 1 → 3.' },
      { id: 'c', text: '4 → 3 → 1 → 2.' }
    ],
    answer: 'a',
    explanation: 'Wood is harvested first, turned into paper pulp, printed into books, and finally read by students.',
    objective: 'Trace one product from raw material to consumer, naming at least three stages in order.',
    source: 'unverified'
  },
  {
    id: 'chn-07',
    concept: 'chain',
    difficulty: 3,
    format: 'scenario',
    prompt: 'If a cooperative dairy collects milk from 50 small village farmers, what role does the cooperative play in the chain?',
    options: [
      { id: 'a', text: 'It pools raw milk together so small farmers can reach cold storage and big city markets.' },
      { id: 'b', text: 'It prevents village families from having milk.' },
      { id: 'c', text: 'It turns milk into timber logs.' }
    ],
    answer: 'a',
    explanation: 'Cooperatives help individual small producers combine their outputs and access transport, processing, and markets.',
    objective: 'Trace one product from raw material to consumer, naming at least three stages in order.',
    source: 'unverified'
  },

  // =========================================================================
  // CONCEPT 5: INTERDEPENDENCE (Sectors needing each other)
  // =========================================================================
  {
    id: 'itd-01',
    concept: 'interdependence',
    difficulty: 1,
    format: 'connection-reasoning',
    prompt: 'Why cannot a textile mill produce clothes without the primary sector?',
    options: [
      { id: 'a', text: 'The mill requires raw cotton or wool, which only nature and farming can supply.' },
      { id: 'b', text: 'Factory workers only know how to sing.' },
      { id: 'c', text: 'Textile mills are built under water.' }
    ],
    answer: 'a',
    explanation: 'The secondary sector cannot manufacture anything without raw materials from the primary sector.',
    objective: 'Explain why the three sectors are interdependent.',
    source: 'unverified'
  },
  {
    id: 'itd-02',
    concept: 'interdependence',
    difficulty: 1,
    format: 'cause-effect',
    prompt: 'How does a cotton farmer depend on the tertiary sector?',
    options: [
      { id: 'a', text: 'The farmer relies on trucks to haul harvest and banks for seasonal loans.' },
      { id: 'b', text: 'The farmer needs trees to weave cotton into cloth.' },
      { id: 'c', text: 'The farmer does not depend on any other sector.' }
    ],
    answer: 'a',
    explanation: 'Farmers depend on tertiary services such as transport, banking, and tool trade to run their farms.',
    objective: 'Explain why the three sectors are interdependent.',
    source: 'unverified'
  },
  {
    id: 'itd-03',
    concept: 'interdependence',
    difficulty: 2,
    format: 'scenario',
    prompt: 'A village has great vegetable farms and eager consumers, but no transport or road. What happens?',
    options: [
      { id: 'a', text: 'Vegetables rot at the farm, while town consumers have no vegetables to buy.' },
      { id: 'b', text: 'Vegetables fly through the air to city homes automatically.' },
      { id: 'c', text: 'Farms immediately turn into furniture factories.' }
    ],
    answer: 'a',
    explanation: 'Without tertiary transport, primary produce cannot reach consumers, showing that sectors depend on each other.',
    objective: 'Name one knock-on effect when one part of the system is disrupted, and say who is affected.',
    source: 'unverified'
  },
  {
    id: 'itd-04',
    concept: 'interdependence',
    difficulty: 2,
    format: 'connection-reasoning',
    prompt: 'What does "interdependence" mean in Class 6 Social Science?',
    options: [
      { id: 'a', text: 'Different sectors and workers depend on and support each other to complete work.' },
      { id: 'b', text: 'Every worker lives completely alone on an island.' },
      { id: 'c', text: 'No one is allowed to trade goods in a market.' }
    ],
    answer: 'a',
    explanation: 'Interdependence means that no sector functions in isolation; each relies on the outputs of the other two.',
    objective: 'Explain why the three sectors are interdependent.',
    source: 'unverified'
  },
  {
    id: 'itd-05',
    concept: 'interdependence',
    difficulty: 2,
    format: 'identify-role',
    prompt: 'Who provides the supportive service that allows a factory to pay electricity bills and buy machinery?',
    options: [
      { id: 'a', text: 'The cooperative bank (tertiary sector).' },
      { id: 'b', text: 'The timber harvester in the deep woods.' },
      { id: 'c', text: 'The cotton seedling growing in the dirt.' }
    ],
    answer: 'a',
    explanation: 'Banking services provide financial facilities that enable factories and farms to operate smoothly.',
    objective: 'Explain why the three sectors are interdependent.',
    source: 'unverified'
  },
  {
    id: 'itd-06',
    concept: 'interdependence',
    difficulty: 3,
    format: 'cause-effect',
    prompt: 'If tractor repair workshops in an agricultural district shut down, who is affected first?',
    options: [
      { id: 'a', text: 'Farmers cannot plough fields efficiently, which slows down crop harvest.' },
      { id: 'b', text: 'Only deep-sea fishermen.' },
      { id: 'c', text: 'No one is affected because tractors do not use machinery.' }
    ],
    answer: 'a',
    explanation: 'Repair services (tertiary) support farmers (primary). If repair stops, agricultural work is hindered.',
    objective: 'Name one knock-on effect when one part of the system is disrupted, and say who is affected.',
    source: 'unverified'
  },
  {
    id: 'itd-07',
    concept: 'interdependence',
    difficulty: 3,
    format: 'predict-next',
    prompt: 'Why is a simple pencil proof of economic interdependence?',
    options: [
      { id: 'a', text: 'Wood from forests, graphite from mines, and paint from factories were united by transport.' },
      { id: 'b', text: 'Because pencils grow fully formed on tall trees.' },
      { id: 'c', text: 'Because only one person did all the work in five minutes.' }
    ],
    answer: 'a',
    explanation: 'Behind a simple pencil is a chain of foresters, miners, factory workers, transporters, and shopkeepers working together.',
    objective: 'Explain why the three sectors are interdependent.',
    source: 'unverified'
  },

  // =========================================================================
  // CONCEPT 6: DISRUPTIONS & RIPPLE EFFECTS
  // =========================================================================
  {
    id: 'dis-01',
    concept: 'disruption',
    difficulty: 1,
    format: 'cause-effect',
    prompt: 'If truck drivers go on strike, what is an immediate knock-on effect on dairy farms?',
    options: [
      { id: 'a', text: 'Fresh milk remains stuck in milk cans and risks spoiling before reaching the plant.' },
      { id: 'b', text: 'Cows immediately stop producing milk.' },
      { id: 'c', text: 'Milk cans turn into wooden desks.' }
    ],
    answer: 'a',
    explanation: 'Transport disruptions trap perishable goods at the farm, directly impacting farmers and consumers.',
    objective: 'Name one knock-on effect when one part of the system is disrupted, and say who is affected.',
    source: 'unverified'
  },
  {
    id: 'dis-02',
    concept: 'disruption',
    difficulty: 1,
    format: 'predict-next',
    prompt: 'When floods block rural roads, what happens to finished goods at the city bazaar shop?',
    options: [
      { id: 'a', text: 'Shop shelves empty as new stock from factories fails to arrive.' },
      { id: 'b', text: 'Shops produce new goods out of nothing.' },
      { id: 'c', text: 'Shopkeepers stop needing to earn an income.' }
    ],
    answer: 'a',
    explanation: 'When incoming supply lines are broken, shop stock depletes and consumers cannot purchase goods.',
    objective: 'Name one knock-on effect when one part of the system is disrupted, and say who is affected.',
    source: 'unverified'
  },
  {
    id: 'dis-03',
    concept: 'disruption',
    difficulty: 2,
    format: 'scenario',
    prompt: 'A pest infestation damages cotton crops across several villages. Who is affected by this disruption?',
    options: [
      { id: 'a', text: 'Farmers harvest less, truck drivers have less cargo, mill workers spin less cloth, and shops have fewer shirts.' },
      { id: 'b', text: 'Only the insects are affected; humans continue as normal.' },
      { id: 'c', text: 'Only people in other distant countries.' }
    ],
    answer: 'a',
    explanation: 'A failure in primary production ripples forward through transporters, mill workers, and shopkeepers.',
    objective: 'Name one knock-on effect when one part of the system is disrupted, and say who is affected.',
    source: 'unverified'
  },
  {
    id: 'dis-04',
    concept: 'disruption',
    difficulty: 2,
    format: 'connection-reasoning',
    prompt: 'Why does a power cut at the dairy processing plant affect city consumers who live miles away?',
    options: [
      { id: 'a', text: 'Because milk cannot be pasteurized and packaged, so safe milk does not reach city shops.' },
      { id: 'b', text: 'Because electricity flows from the milk carton into city homes.' },
      { id: 'c', text: 'Because city consumers must go to the plant to milk cows themselves.' }
    ],
    answer: 'a',
    explanation: 'Disruptions in manufacturing prevent finished goods from being prepared for market distribution.',
    objective: 'Name one knock-on effect when one part of the system is disrupted, and say who is affected.',
    source: 'unverified'
  },
  {
    id: 'dis-05',
    concept: 'disruption',
    difficulty: 2,
    format: 'cause-effect',
    prompt: 'If a carpenter injures his hand and the furniture workshop closes, what is the ripple effect?',
    options: [
      { id: 'a', text: 'Timber sits unshaped in the workshop, and neighborhood schools wait longer for new desks.' },
      { id: 'b', text: 'Forest trees immediately fall down.' },
      { id: 'c', text: 'Students must weave cotton uniforms instead.' }
    ],
    answer: 'a',
    explanation: 'When secondary manufacturing pauses, raw materials pile up and final consumers experience shortages of goods.',
    objective: 'Name one knock-on effect when one part of the system is disrupted, and say who is affected.',
    source: 'unverified'
  },
  {
    id: 'dis-06',
    concept: 'disruption',
    difficulty: 3,
    format: 'predict-next',
    prompt: 'When a bank temporarily halts agricultural loans, how does that affect next year’s food supply?',
    options: [
      { id: 'a', text: 'Farmers may be unable to purchase quality seeds and fertilizer, leading to smaller harvests.' },
      { id: 'b', text: 'Farms will automatically produce triple the grain without seeds.' },
      { id: 'c', text: 'Bazaar shops will print their own food.' }
    ],
    answer: 'a',
    explanation: 'Without financial credit from tertiary banking, farmers struggle to invest in seeds and farming tools.',
    objective: 'Name one knock-on effect when one part of the system is disrupted, and say who is affected.',
    source: 'unverified'
  },
  {
    id: 'dis-07',
    concept: 'disruption',
    difficulty: 3,
    format: 'scenario',
    prompt: 'During a prolonged drought, why do mill workers lose work even though their factory machines are in perfect condition?',
    options: [
      { id: 'a', text: 'Because without raw materials from nature, the machines have nothing to process.' },
      { id: 'b', text: 'Because machines only run when it is raining.' },
      { id: 'c', text: 'Because factory workers only eat cotton.' }
    ],
    answer: 'a',
    explanation: 'Secondary factories depend completely on primary inputs. No raw materials means no manufacturing work.',
    objective: 'Name one knock-on effect when one part of the system is disrupted, and say who is affected.',
    source: 'unverified'
  }
];
