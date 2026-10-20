export type Category = 'Vegetables' | 'Grains' | 'Fruits' | 'Oil seeds' | 'Others';

export interface Product {
  id: string;
  name: string;
  title: string;
  category: Category;
  price: number; // Rs per kg (demo)
  stock: number; // kg available
  farmer: string;
  location: string;
  image?: string; // original asset from the Figma frames (large)
  thumb?: string; // original asset (small)
  emoji: string;
  tint: string;
  organic: boolean;
  nearby: boolean;
  trend: number; // % change
  rating: number;
  reviews: number;
  history: number[]; // Jan..Jun, Rs per kg
  similar: string[];
  phone: string;
}

const p = (x: Product) => x;

export const PRODUCTS: Product[] = [
  p({ id: 'tomato', name: 'Tomato', title: 'Premium Tomatoes', category: 'Vegetables', price: 20, stock: 500, farmer: 'Ramesh Kumar', location: 'Mysore, Karnataka', image: '/assets/tomato.jpg', emoji: '🍅', tint: '#fde2e0', organic: true, nearby: true, trend: 12, rating: 4.8, reviews: 512, history: [14, 16, 15, 18, 18, 20], similar: ['rice', 'maize'], phone: '+91 98450 11001' }),
  p({ id: 'onion', name: 'Onion', title: 'Premium Onions', category: 'Vegetables', price: 18, stock: 600, farmer: 'Suresh kumar', location: 'Halasur, Karnataka', image: '/assets/onion.jpg', emoji: '🧅', tint: '#eadcf0', organic: false, nearby: false, trend: -5, rating: 4.6, reviews: 341, history: [22, 21, 20, 19, 19, 18], similar: ['potato', 'carrot'], phone: '+91 98450 11002' }),
  p({ id: 'potato', name: 'Potato', title: 'Premium Potatoes', category: 'Vegetables', price: 22, stock: 500, farmer: 'Nithesh reddy', location: 'Coorg, Karnataka', image: '/assets/potato.jpg', emoji: '🥔', tint: '#f3e6c8', organic: true, nearby: false, trend: 8, rating: 4.7, reviews: 428, history: [18, 19, 19, 20, 21, 22], similar: ['onion', 'carrot'], phone: '+91 98450 11003' }),
  p({ id: 'green-chilli', name: 'Green Chilli', title: 'Premium Green Chillies', category: 'Vegetables', price: 10, stock: 500, farmer: 'Rajesh', location: 'Mysore, Karnataka', image: '/assets/chilli.jpg', emoji: '🌶️', tint: '#d9f0d0', organic: true, nearby: true, trend: 3, rating: 4.5, reviews: 187, history: [9, 9, 10, 10, 10, 10], similar: ['tomato', 'cabbage'], phone: '+91 98450 11004' }),
  p({ id: 'carrot', name: 'Carrot', title: 'Premium Carrots', category: 'Vegetables', price: 15, stock: 800, farmer: 'Suresh kumar', location: 'Halasur, Karnataka', image: '/assets/carrot.jpg', emoji: '🥕', tint: '#fde5cc', organic: false, nearby: false, trend: 6, rating: 4.6, reviews: 256, history: [12, 12, 13, 14, 14, 15], similar: ['potato', 'onion'], phone: '+91 98450 11002' }),
  p({ id: 'cabbage', name: 'Cabbage', title: 'Premium Cabbage', category: 'Vegetables', price: 55, stock: 200, farmer: 'Magesh', location: 'Halasur, Karnataka', image: '/assets/cabbage.jpg', emoji: '🥬', tint: '#e2f2d8', organic: true, nearby: false, trend: 4, rating: 4.4, reviews: 98, history: [48, 50, 51, 52, 54, 55], similar: ['green-chilli', 'carrot'], phone: '+91 98450 11005' }),

  p({ id: 'rice', name: 'Rice', title: 'Premium Rice', category: 'Grains', price: 52, stock: 2000, farmer: 'Mahesh Gowda', location: 'Mandya, Karnataka', thumb: '/assets/rice.jpg', emoji: '🍚', tint: '#f4efe0', organic: true, nearby: false, trend: 2, rating: 4.7, reviews: 623, history: [48, 49, 50, 50, 51, 52], similar: ['maize', 'wheat'], phone: '+91 98450 22001' }),
  p({ id: 'maize', name: 'Maize', title: 'Premium Maize', category: 'Grains', price: 24, stock: 1500, farmer: 'Basavaraj', location: 'Hassan, Karnataka', thumb: '/assets/maize.jpg', emoji: '🌽', tint: '#fbefb8', organic: false, nearby: false, trend: -2, rating: 4.3, reviews: 204, history: [26, 26, 25, 25, 24, 24], similar: ['rice', 'wheat'], phone: '+91 98450 22002' }),
  p({ id: 'wheat', name: 'Wheat', title: 'Premium Wheat', category: 'Grains', price: 28, stock: 1800, farmer: 'Kiran Patil', location: 'Mysore, Karnataka', emoji: '🌾', tint: '#f3e3b5', organic: true, nearby: true, trend: 1, rating: 4.5, reviews: 310, history: [26, 27, 27, 27, 28, 28], similar: ['rice', 'maize'], phone: '+91 98450 22003' }),
  p({ id: 'ragi', name: 'Ragi', title: 'Premium Ragi', category: 'Grains', price: 34, stock: 900, farmer: 'Lakshmamma', location: 'Mandya, Karnataka', emoji: '🌾', tint: '#e8dccb', organic: true, nearby: false, trend: 5, rating: 4.8, reviews: 144, history: [30, 31, 32, 33, 33, 34], similar: ['rice', 'wheat'], phone: '+91 98450 22004' }),

  p({ id: 'banana', name: 'Banana', title: 'Premium Bananas', category: 'Fruits', price: 35, stock: 700, farmer: 'Chandru', location: 'Mysore, Karnataka', emoji: '🍌', tint: '#fff3b0', organic: true, nearby: true, trend: 7, rating: 4.6, reviews: 289, history: [30, 31, 32, 33, 34, 35], similar: ['mango', 'pomegranate'], phone: '+91 98450 33001' }),
  p({ id: 'mango', name: 'Mango', title: 'Premium Mangoes', category: 'Fruits', price: 80, stock: 400, farmer: 'Venkatesh', location: 'Kolar, Karnataka', emoji: '🥭', tint: '#ffe0a8', organic: false, nearby: false, trend: 14, rating: 4.9, reviews: 702, history: [60, 64, 70, 74, 78, 80], similar: ['banana', 'pomegranate'], phone: '+91 98450 33002' }),
  p({ id: 'pomegranate', name: 'Pomegranate', title: 'Premium Pomegranates', category: 'Fruits', price: 110, stock: 250, farmer: 'Shivanna', location: 'Chitradurga, Karnataka', emoji: '🍎', tint: '#f9d3d6', organic: true, nearby: false, trend: 9, rating: 4.7, reviews: 166, history: [96, 98, 102, 105, 108, 110], similar: ['mango', 'banana'], phone: '+91 98450 33003' }),

  p({ id: 'groundnut', name: 'Groundnut', title: 'Premium Groundnut', category: 'Oil seeds', price: 68, stock: 1200, farmer: 'Narayana Swamy', location: 'Tumakuru, Karnataka', emoji: '🥜', tint: '#ead7bd', organic: false, nearby: false, trend: 3, rating: 4.4, reviews: 131, history: [62, 64, 65, 66, 67, 68], similar: ['sunflower', 'sesame'], phone: '+91 98450 44001' }),
  p({ id: 'sunflower', name: 'Sunflower', title: 'Premium Sunflower Seeds', category: 'Oil seeds', price: 62, stock: 800, farmer: 'Manjunath', location: 'Raichur, Karnataka', emoji: '🌻', tint: '#fff0a6', organic: false, nearby: false, trend: -1, rating: 4.2, reviews: 90, history: [64, 64, 63, 63, 62, 62], similar: ['groundnut', 'sesame'], phone: '+91 98450 44002' }),
  p({ id: 'sesame', name: 'Sesame', title: 'Premium Sesame', category: 'Oil seeds', price: 120, stock: 300, farmer: 'Gangadhar', location: 'Gadag, Karnataka', emoji: '🫘', tint: '#efe5d1', organic: true, nearby: false, trend: 6, rating: 4.6, reviews: 75, history: [105, 108, 112, 114, 118, 120], similar: ['groundnut', 'sunflower'], phone: '+91 98450 44003' }),

  p({ id: 'coffee', name: 'Coffee Beans', title: 'Premium Coffee Beans', category: 'Others', price: 320, stock: 150, farmer: 'Appaiah', location: 'Coorg, Karnataka', emoji: '☕', tint: '#e5d3c4', organic: true, nearby: false, trend: 11, rating: 4.9, reviews: 410, history: [280, 288, 296, 304, 312, 320], similar: ['turmeric', 'coconut'], phone: '+91 98450 55001' }),
  p({ id: 'turmeric', name: 'Turmeric', title: 'Premium Turmeric', category: 'Others', price: 95, stock: 350, farmer: 'Shankar', location: 'Chamarajanagar, Karnataka', emoji: '🟡', tint: '#ffe58f', organic: true, nearby: true, trend: 4, rating: 4.7, reviews: 118, history: [86, 88, 90, 92, 94, 95], similar: ['coffee', 'coconut'], phone: '+91 98450 55002' }),
  p({ id: 'coconut', name: 'Coconut', title: 'Premium Coconuts', category: 'Others', price: 30, stock: 1000, farmer: 'Ramanna', location: 'Tiptur, Karnataka', emoji: '🥥', tint: '#efe6dc', organic: false, nearby: false, trend: 2, rating: 4.5, reviews: 201, history: [27, 28, 28, 29, 29, 30], similar: ['coffee', 'turmeric'], phone: '+91 98450 55003' }),
];

export const CATEGORIES: ('All' | Category)[] = ['All', 'Vegetables', 'Grains', 'Fruits', 'Oil seeds', 'Others'];

export const getProduct = (id: string | undefined) => PRODUCTS.find((x) => x.id === id);

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export const productDescription = (x: Product) =>
  `Our premium ${x.name.toLowerCase()} is carefully cultivated using sustainable farming practices. It is naturally cleaned and sorted to ensure the best quality.\nSuitable for home cooking, retail and wholesale use.\nDirectly sourced from local farmers, ensuring fair prices and fresh produce.`;

export const productSpecs = (x: Product): [string, string][] => [
  ['Category', x.category],
  ['Price', `Rs ${x.price} per kg`],
  ['Stock available', `${x.stock} kg`],
  ['Grown by', x.farmer],
  ['Origin', x.location],
  ['Farming method', x.organic ? 'Organic (natural inputs)' : 'Conventional'],
  ['Minimum order', '1 kg'],
];

export const productReviews = (x: Product) => [
  { who: 'Anitha R.', stars: 5, text: `Fresh ${x.name.toLowerCase()}, delivered well packed. Will order again.` },
  { who: 'Mohan S.', stars: 5, text: 'Good quality and a fair price compared to the local market.' },
  { who: 'Kavitha M.', stars: 4, text: 'Quality was good. Delivery took a day longer than expected.' },
];
