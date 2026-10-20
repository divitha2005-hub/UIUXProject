export interface Scheme {
  id: string;
  name: string;
  tag: string;
  summary: string;
  benefits: string[];
  eligibility: string;
}

// Sample information for the prototype. Always confirm details on the official portal.
export const SCHEMES: Scheme[] = [
  { id: 'pm-kisan', name: 'PM-KISAN', tag: 'Income support', summary: 'Direct income support for small and marginal farmer families.', benefits: ['Rs 6,000 per year paid in three instalments', 'Money goes directly to the bank account'], eligibility: 'Landholding farmer families (see official rules).' },
  { id: 'pmfby', name: 'PM Fasal Bima Yojana', tag: 'Crop insurance', summary: 'Insurance cover against crop loss from natural calamities, pests and diseases.', benefits: ['Low premium for farmers', 'Cover from sowing to harvest'], eligibility: 'Farmers growing notified crops in notified areas.' },
  { id: 'kcc', name: 'Kisan Credit Card', tag: 'Credit', summary: 'Short-term credit for seeds, fertiliser and other crop needs.', benefits: ['Flexible withdrawal and repayment', 'Interest concession on timely repayment'], eligibility: 'Farmers, tenant farmers and sharecroppers.' },
  { id: 'shc', name: 'Soil Health Card', tag: 'Soil testing', summary: 'Soil testing with crop-wise nutrient and fertiliser recommendations.', benefits: ['Know your soil nutrient status', 'Use the right fertiliser dose and save cost'], eligibility: 'All farmers.' },
];
