export interface Disease {
  id: string;
  name: string;
  crop: string;
  overview: string;
  remedies: { organic: string[]; physical: string[]; chemical: string[] };
  prevention: string[];
  baseScore: number; // severity /10
}

export const DISEASES: Disease[] = [
  {
    id: 'early-blight',
    name: 'Early Blight',
    crop: 'tomato',
    overview:
      'Early Blight is a common fungal disease that affects tomato plants.\nIt usually appears as dark spots on older leaves and can reduce yield if not controlled.',
    remedies: {
      organic: ['Spray 3% neem oil solution every 7 days.', 'Apply a copper-based organic fungicide in the evening.', 'Use compost tea on the soil to boost plant resistance.'],
      physical: ['Remove and burn badly affected lower leaves.', 'Prune for airflow and keep leaves off the ground.', 'Mulch the base so soil does not splash onto leaves.'],
      chemical: ['Use mancozeb or chlorothalonil as per the label dose.', 'Rotate fungicide groups to avoid resistance.', 'Stop spraying at least 7 days before harvest (check the label).'],
    },
    prevention: ['Rotate crops: avoid tomato or potato in the same plot for 2 seasons.', 'Water at the base in the morning, not on the leaves.', 'Keep proper spacing and stake the plants.', 'Use disease-free seed and clean tools between plants.'],
    baseScore: 6.8,
  },
  {
    id: 'late-blight',
    name: 'Late Blight',
    crop: 'tomato',
    overview:
      'Late Blight spreads quickly in cool, wet weather and can destroy a crop within days.\nLook for water-soaked patches on leaves that turn brown, often with white growth underneath.',
    remedies: {
      organic: ['Spray Bordeaux mixture (1%) at the first sign.', 'Remove infected plants early and dispose of them away from the field.', 'Use Trichoderma-enriched compost in the soil.'],
      physical: ['Uproot and burn severely infected plants.', 'Improve drainage so water does not stand in the field.', 'Avoid working in the field when leaves are wet.'],
      chemical: ['Use metalaxyl + mancozeb as per the label.', 'Repeat at 7 to 10 day intervals during wet spells.', 'Wear gloves and a mask while spraying.'],
    },
    prevention: ['Plant resistant varieties where available.', 'Avoid overhead irrigation.', 'Scout the field twice a week in the rainy season.', 'Do not keep volunteer potato or tomato plants nearby.'],
    baseScore: 8.1,
  },
  {
    id: 'septoria-leaf-spot',
    name: 'Septoria Leaf Spot',
    crop: 'tomato',
    overview:
      'Septoria Leaf Spot shows up as many small round spots with grey centres and dark edges.\nIt starts on the lower leaves and moves upward, weakening the plant.',
    remedies: {
      organic: ['Spray neem oil or a copper soap every 7 to 10 days.', 'Apply a thick layer of mulch under plants.', 'Use a baking-soda based spray on early spots.'],
      physical: ['Pick off spotted leaves and discard them.', 'Space plants so leaves dry quickly.', 'Stake or cage plants to keep leaves off the soil.'],
      chemical: ['Use chlorothalonil or a copper fungicide as per the label.', 'Begin spraying when the first spots appear.', 'Follow the pre-harvest interval on the label.'],
    },
    prevention: ['Rotate crops for 2 to 3 years.', 'Clear plant debris after harvest.', 'Water at soil level.', 'Disinfect tools and stakes.'],
    baseScore: 4.6,
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    crop: 'tomato',
    overview:
      'Powdery Mildew forms a white, dusty coating on the upper side of leaves.\nIt thrives in warm days and humid nights and slows plant growth.',
    remedies: {
      organic: ['Spray diluted milk (1:9 with water) or sulphur-based organic spray.', 'Use neem oil weekly during humid weather.', 'Apply potassium bicarbonate spray on early signs.'],
      physical: ['Remove heavily coated leaves.', 'Increase sunlight and airflow by pruning.', 'Avoid crowding plants.'],
      chemical: ['Use wettable sulphur or hexaconazole as per the label.', 'Do not spray sulphur in very hot weather.', 'Rotate fungicides between sprays.'],
    },
    prevention: ['Choose tolerant varieties.', 'Avoid excess nitrogen fertiliser.', 'Keep the field weed free.', 'Scout regularly in humid weather.'],
    baseScore: 3.9,
  },
  {
    id: 'leaf-curl',
    name: 'Leaf Curl Virus',
    crop: 'tomato',
    overview:
      'Leaf Curl Virus makes leaves curl upward, turn thick and yellow, and stunts the plant.\nIt is spread by whiteflies, so controlling the insect is the key.',
    remedies: {
      organic: ['Use yellow sticky traps to catch whiteflies.', 'Spray neem seed kernel extract (5%) every 7 days.', 'Grow border crops such as maize as a barrier.'],
      physical: ['Uproot and destroy infected plants early.', 'Cover nursery beds with fine insect-proof net.', 'Remove weeds that host whiteflies.'],
      chemical: ['Use a recommended systemic insecticide against whitefly (label dose).', 'Rotate insecticide groups.', 'Consult your local agriculture officer before spraying.'],
    },
    prevention: ['Use virus-free seedlings.', 'Plant resistant or tolerant hybrids.', 'Install insect-proof nets in the nursery.', 'Avoid planting near older infected fields.'],
    baseScore: 7.4,
  },
  {
    id: 'healthy',
    name: 'Healthy Leaf',
    crop: 'tomato',
    overview:
      'No clear signs of disease were found in this image.\nThe leaf looks healthy, but keep scouting regularly because early signs are easy to miss.',
    remedies: {
      organic: ['No treatment needed.', 'A weekly neem oil spray can help prevent pests.', 'Keep adding compost to the soil.'],
      physical: ['Keep the field clean of fallen leaves and weeds.', 'Maintain good spacing for airflow.', 'Check the underside of leaves every few days.'],
      chemical: ['No chemical spray is needed.', 'Avoid unnecessary spraying.', 'Spray only when a problem is confirmed.'],
    },
    prevention: ['Water at the base in the morning.', 'Rotate crops each season.', 'Use disease-free seed.', 'Scout the field twice a week.'],
    baseScore: 1.2,
  },
];

export const getDisease = (id: string) => DISEASES.find((d) => d.id === id) ?? DISEASES[0];

export const severityLabel = (score: number) => (score < 4 ? 'Low Severity' : score < 7 ? 'Moderate Severity' : 'High Severity');
