const BUSINESS_KEYWORDS = new Set([
  // Legal suffixes
  'pvt', 'ltd', 'llc', 'inc', 'corp', 'co', 'company', 'companies',
  // Common business types
  'enterprises', 'enterprise', 'solutions', 'solution', 'services', 'service',
  'group', 'groups', 'industries', 'industry', 'traders', 'trading', 'trade',
  'agency', 'agencies', 'studio', 'studios', 'shop', 'store', 'stores',
  'technologies', 'technology', 'tech', 'digital', 'media', 'creatives', 'creative',
  'consultancy', 'consulting', 'consultant', 'associates', 'associate',
  'brothers', 'brother', 'sons', 'son', 'international', 'global',
  'exports', 'export', 'imports', 'import', 'distributors', 'distributor',
  'suppliers', 'supplier', 'manufacturers', 'manufacturer',
  // Sector words
  'clinic', 'hospital', 'school', 'academy', 'salon', 'parlour', 'parlor',
  'construction', 'builders', 'builder', 'realty', 'property', 'properties',
  'designs', 'design', 'mart', 'bazaar', 'bazar', 'works', 'workshop',
  'center', 'centre', 'hub', 'world', 'zone', 'point', 'house',
  'infotech', 'infosystems', 'systems', 'system', 'networks', 'network', 'telecom',
  'pharma', 'chemist', 'medical', 'healthcare', 'care', 'finance', 'financial',
  'management', 'electronics', 'electricals', 'electrical', 'electric',
  'computers', 'computer', 'hardware', 'software', 'mobile', 'mobiles',
  'foods', 'food', 'beverages', 'textiles', 'fabrics', 'garments', 'clothing',
  'fashion', 'jewellers', 'jewellery', 'jewelry', 'motors', 'automobiles',
  'auto', 'tyres', 'spare', 'hotel', 'restaurant', 'restaurants', 'cafe',
  'catering', 'bakery', 'dairy', 'agro', 'agriculture', 'organic', 'farms', 'farm',
  'nursery', 'irrigation', 'tools', 'equipment', 'furniture', 'interiors', 'decor',
  'paint', 'chemicals', 'plastics', 'printing', 'packaging', 'logistics',
  'transport', 'courier', 'travels', 'travel', 'tours', 'tourism', 'cargo',
  'security', 'cleaning', 'staffing', 'recruitment', 'placement',
  'coaching', 'tuition', 'institute', 'lab', 'laboratory', 'diagnostic',
  'dental', 'optical', 'optical', 'nursing', 'sarees', 'garment',
  'india', 'bharat', 'shri', 'sri', 'sai', 'shree', 'new', 'modern',
  'national', 'general', 'super', 'mega', 'royal', 'elite', 'prime',
  'best', 'top', 'first', 'city', 'urban', 'rural',
]);

const COMMON_FIRST_NAMES = new Set([
  // Indian male
  'rahul', 'rohit', 'amit', 'vikas', 'rajesh', 'suresh', 'ramesh', 'mahesh', 'dinesh',
  'mukesh', 'rakesh', 'ganesh', 'naresh', 'yogesh', 'umesh', 'anil', 'sunil', 'kunal',
  'vishal', 'ankit', 'sumit', 'arjun', 'akash', 'deepak', 'sanjay', 'vijay', 'ajay',
  'ravi', 'mohan', 'sohan', 'shyam', 'ram', 'hari', 'dev', 'raj', 'jay', 'vivek',
  'nitin', 'sachin', 'raju', 'sunny', 'lucky', 'sonu', 'monu', 'bunty', 'bobby',
  'kiran', 'nikhil', 'abhishek', 'abhinav', 'abhijit', 'aman', 'arun', 'ashish',
  'bharat', 'chirag', 'dhruv', 'gaurav', 'hemant', 'himanshu', 'ishaan', 'jatin',
  'kamal', 'kartik', 'lalit', 'manish', 'manoj', 'neeraj', 'omkar', 'pankaj', 'parth',
  'pranav', 'pratik', 'praveen', 'puneet', 'rajat', 'rajiv', 'rajeev', 'rohan',
  'rupesh', 'sameer', 'sanjeev', 'santosh', 'shivam', 'shreyas', 'shubham',
  'siddharth', 'sudhir', 'suraj', 'tarun', 'tushar', 'uday', 'varun', 'vikram',
  'vinay', 'vineet', 'virendra', 'yash', 'yogendra', 'zaheer', 'raman', 'chetan',
  'harish', 'devesh', 'arvind', 'ashok', 'girish', 'govind', 'kapil', 'lokesh',
  'mitesh', 'navin', 'nilesh', 'prashant', 'ravindra', 'shailesh', 'shankar',
  'sudheer', 'vipul', 'brijesh', 'rakshit', 'dilip', 'kishor', 'pramod', 'satish',
  // Indian female
  'priya', 'pooja', 'neha', 'anjali', 'kavita', 'sunita', 'geeta', 'aarti', 'suman',
  'renu', 'meena', 'reena', 'seema', 'rekha', 'usha', 'asha', 'manisha', 'nisha',
  'vandana', 'deepika', 'rani', 'shivani', 'divya', 'swati', 'sneha', 'preeti',
  'jyoti', 'radha', 'ritu', 'archana', 'alka', 'ekta', 'shruti', 'priyanka',
  'aishwarya', 'ankita', 'ananya', 'aditi', 'bhavna', 'charu', 'disha', 'garima',
  'gunjan', 'heena', 'ishita', 'kajal', 'komal', 'kratika', 'lakshmi', 'mamta',
  'meghna', 'monika', 'namrata', 'natasha', 'nikita', 'pallavi', 'poonam', 'prachi',
  'pragati', 'prajakta', 'priyanshi', 'rachna', 'rashmi', 'reeta', 'roshni',
  'rupali', 'sakshi', 'saloni', 'sapna', 'sarita', 'shilpa', 'shraddha', 'simran',
  'smita', 'sonali', 'sonam', 'surbhi', 'tanvi', 'tanya', 'twinkle', 'varsha',
  'vidya', 'vimla', 'yamini', 'madhuri', 'suchitra', 'swapna', 'geeta', 'lalita',
  'manju', 'kamla', 'sheetal', 'sudha', 'sangita', 'sangeetha', 'sushma', 'lata',
  'shanta', 'parvati', 'savita', 'pushpa', 'hema', 'anita', 'meera', 'veena',
  // Western common
  'john', 'james', 'robert', 'michael', 'william', 'david', 'richard', 'joseph',
  'thomas', 'charles', 'christopher', 'daniel', 'matthew', 'anthony', 'mark',
  'donald', 'steven', 'paul', 'andrew', 'kenneth', 'george', 'joshua', 'kevin',
  'brian', 'edward', 'ronald', 'timothy', 'jason', 'jeffrey', 'ryan', 'jacob',
  'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott',
  'samantha', 'jessica', 'ashley', 'jennifer', 'sarah', 'stephanie', 'amanda',
  'melissa', 'elizabeth', 'emma', 'olivia', 'sophia', 'ava', 'mia', 'emily',
  'peter', 'simon', 'tony', 'harry', 'alan', 'adam', 'alex', 'ben', 'chris',
  // Also first-name-like usage of common surnames
  'kumar', 'shankar', 'prakash', 'narayan', 'chandra', 'prasad',
]);

/**
 * Returns an error message if the value looks like a personal name,
 * or null if it looks like a valid company/business name.
 */
export function validateCompanyName(value: string): string | null {
  const name = value.trim();
  if (!name) return 'Please enter your company name.';

  const lower = name.toLowerCase();
  const words = name.split(/\s+/);

  // Numbers in the name → almost certainly a business (e.g. "3M", "Shop No. 5")
  if (/\d/.test(name)) return null;

  // Apostrophe pattern → "Rahul's Mobile Shop" → business
  if (name.includes("'") || name.includes('’')) return null;

  // Any business keyword found anywhere in the name → it's a business
  if (words.some(w => BUSINESS_KEYWORDS.has(w.toLowerCase()))) return null;

  // Only flag 2-word names — single words could be brand names ("Airtel", "Reliance")
  // and 3+ word names are usually business names
  if (words.length !== 2) return null;

  const [first, second] = words;

  // Both words must be all-alphabetic title-case to be a personal name pattern
  const titleAlpha = /^[A-Z][a-z]+$/;
  if (!titleAlpha.test(first) || !titleAlpha.test(second)) return null;

  // Reasonable personal-name word lengths
  if (first.length < 2 || first.length > 16) return null;
  if (second.length < 2 || second.length > 16) return null;

  // First word is a known first name → flag as personal name
  if (COMMON_FIRST_NAMES.has(first.toLowerCase())) {
    return 'Please enter your company or business name, not your personal name. (e.g. "Rahul Electronics" or "Sharma Traders")';
  }

  return null;
}
