import { ProductJourney } from '../types/economy';

export const PRODUCT_JOURNEYS: ProductJourney[] = [
  {
    id: 'cotton-shirt',
    product: 'A Cotton Shirt',
    description: 'Trace how white fluffy cotton in a field becomes the clean shirt you wear to school.',
    stages: [
      {
        nodeId: 'cotton-farm',
        caption: 'Farmer Ramesh harvests fluffy white cotton pods under the warm sun.',
        changeHere: 'Cotton is harvested from nature as a raw material.'
      },
      {
        nodeId: 'transport-truck',
        caption: 'Driver Jaspreet loads cotton bales into his truck and heads toward the mill.',
        changeHere: 'Transport carries the bulky harvest along the highway.'
      },
      {
        nodeId: 'textile-mill',
        caption: 'Worker Anand spins fibers into thread, weaves cloth, and stitches a shirt.',
        changeHere: 'Raw cotton is transformed into a finished wearable good.'
      },
      {
        nodeId: 'bazaar-shop',
        caption: 'Shopkeeper Salim places the ironed shirt neatly on display in the bazaar.',
        changeHere: 'The shirt is ready in the market where buyers visit.'
      },
      {
        nodeId: 'consumer-household',
        caption: 'Student Aarav buys and wears the cotton shirt to class every day.',
        changeHere: 'The product reaches the consumer who uses it.'
      }
    ],
    source: 'unverified'
  },
  {
    id: 'fresh-milk',
    product: 'A Carton of Milk',
    description: 'See how milk collected from village cows reaches your breakfast glass safely.',
    stages: [
      {
        nodeId: 'dairy-farm',
        caption: 'Farmer Sunita feeds cows nutritious fodder and milks them at sunrise.',
        changeHere: 'Fresh milk is gathered directly from domestic livestock.'
      },
      {
        nodeId: 'transport-truck',
        caption: 'An insulated tanker carries the chilled milk cans quickly to town.',
        changeHere: 'Cold transport prevents fresh milk from spoiling on the road.'
      },
      {
        nodeId: 'dairy-plant',
        caption: 'Technician Meera pasteurizes the milk and seals it in hygienic cartons.',
        changeHere: 'Raw milk is treated for safe drinking and packaged.'
      },
      {
        nodeId: 'bazaar-shop',
        caption: 'Shopkeeper Salim stocks fresh cartons in the grocery cooler each morning.',
        changeHere: 'Cartons are kept cool and accessible for local families.'
      },
      {
        nodeId: 'consumer-household',
        caption: 'Aarav drinks a warm glass of nutritious milk before leaving for school.',
        changeHere: 'The drink provides nourishment to the consumer.'
      }
    ],
    source: 'unverified'
  },
  {
    id: 'wooden-desk',
    product: 'A Wooden School Desk',
    description: 'Follow the path from a forest tree to the classroom desk where you study.',
    stages: [
      {
        nodeId: 'timber-forest',
        caption: 'Forester Birju collects fallen wood logs responsibly from the forest grove.',
        changeHere: 'Timber is drawn from nature as heavy raw logs.'
      },
      {
        nodeId: 'transport-truck',
        caption: 'Jaspreet secures the heavy timber logs with chains onto the flatbed truck.',
        changeHere: 'Transport brings heavy timber from woodland to workshop.'
      },
      {
        nodeId: 'furniture-workshop',
        caption: 'Carpenter Dev saws the timber, smoothes planks, and nails a solid desk.',
        changeHere: 'Rough timber logs become a smooth, useful study desk.'
      },
      {
        nodeId: 'bazaar-shop',
        caption: 'Salim supplies the finished wooden desks to schools in the neighborhood.',
        changeHere: 'The desk is stocked and supplied to community buyers.'
      },
      {
        nodeId: 'consumer-household',
        caption: 'Class 6 students sit together at the wooden desk to write their notes.',
        changeHere: 'The desk supports children while studying in school.'
      }
    ],
    source: 'unverified'
  }
];
