export interface LocalityNode {
  id: string;
  category: string;
  name: string;
  meta: string;
  lat: number;
  lng: number;
}

export const PROJECT_NAME = "The Eastern Chambers";
export const PROJECT_LOCATION = "Amber Compound, LBS Marg, Vikhroli West, Mumbai";
// High-precision geographic anchor for The Eastern Chambers (Amber Compound, Plot No. 11A, LBS Marg, Vikhroli West)
export const PROJECT_CENTER = { lat: 19.1096, lng: 72.9258 };

export const CATEGORIES = {
  nearbyAreas: { label: "Nearby Areas", color: "#3b82f6", icon: "🏙️" },
  businessParks: { label: "Business Parks", color: "#a855f7", icon: "🏢" },
  healthcare: { label: "Healthcare", color: "#ef4444", icon: "🏥" },
  hospitality: { label: "Hospitality", color: "#f97316", icon: "🏨" },
  entertainment: { label: "Entertainment", color: "#ec4899", icon: "🛍️" },
  existingConnectivity: { label: "Existing Connectivity", color: "#06b6d4", icon: "🚆" },
  upcomingInfrastructure: { label: "Upcoming Infrastructure", color: "#10b981", icon: "🚀" },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const NODES: LocalityNode[] = [
  // 1. Nearby Areas
  { id: "near-powai", category: "nearbyAreas", name: "Powai (Hiranandani)", meta: "2.9 KM · 8 min", lat: 19.1200, lng: 72.9080 },
  { id: "near-kanjur", category: "nearbyAreas", name: "Kanjurmarg", meta: "3.1 KM · 6 min", lat: 19.1302, lng: 72.9325 },
  { id: "near-ghatkopar", category: "nearbyAreas", name: "Ghatkopar", meta: "4.2 KM · 8 min", lat: 19.0860, lng: 72.9080 },
  { id: "near-mulund", category: "nearbyAreas", name: "Mulund", meta: "10 KM · 15 min", lat: 19.1726, lng: 72.9565 },
  { id: "near-andheri", category: "nearbyAreas", name: "Andheri East (MIDC/SEEPZ)", meta: "10.9 KM · 20 min", lat: 19.1197, lng: 72.8464 },
  { id: "near-thane", category: "nearbyAreas", name: "Thane (Teen Hath Naka)", meta: "12.3 KM · 18 min", lat: 19.1860, lng: 72.9650 },
  { id: "near-bkc", category: "nearbyAreas", name: "BKC (Bandra Kurla Complex)", meta: "10 KM · 18 min", lat: 19.0665, lng: 72.8685 },
  { id: "near-navimumbai", category: "nearbyAreas", name: "Navi Mumbai (Airoli / Vashi)", meta: "11.1 KM · 20 min", lat: 19.0750, lng: 72.9980 },

  // 2. Business Parks & Corporate Hubs
  { id: "bp-91", category: "businessParks", name: "91springboard Vikhroli", meta: "0.1 KM · 1 min walk", lat: 19.1092, lng: 72.9268 },
  { id: "bp-embassy", category: "businessParks", name: "Embassy 247 Park (LBS Marg)", meta: "1.6 KM · 4 min", lat: 19.1204, lng: 72.9272 },
  { id: "bp-godrej-one", category: "businessParks", name: "Godrej One & The Trees", meta: "0.7 KM · 3 min", lat: 19.1082, lng: 72.9210 },
  { id: "bp-powai-supreme", category: "businessParks", name: "Supreme Business Park (Powai)", meta: "2.4 KM · 6 min", lat: 19.1108, lng: 72.9082 },
  { id: "bp-mapletree", category: "businessParks", name: "Hiranandani Business Park (Powai)", meta: "2.3 KM · 6 min", lat: 19.1186, lng: 72.9122 },
  { id: "bp-lodha", category: "businessParks", name: "Lodha Supremus (Kanjurmarg)", meta: "3.2 KM · 7 min", lat: 19.1305, lng: 72.9332 },
  { id: "bp-amani", category: "businessParks", name: "Amani Knowledge Park", meta: "0.5 KM · 2 min", lat: 19.1062, lng: 72.9245 },
  { id: "bp-mtc", category: "businessParks", name: "Mumbai Trade Centre (BKC)", meta: "10 KM · 18 min", lat: 19.0665, lng: 72.8685 },

  // 3. Healthcare Facilities
  { id: "hc-samarth", category: "healthcare", name: "Samarth Hospital (LBS Marg)", meta: "0.1 KM · 1 min walk", lat: 19.1096, lng: 72.9265 },
  { id: "hc-nursing", category: "healthcare", name: "Healthcare Nursing Home", meta: "0.9 KM · 3 min", lat: 19.1033, lng: 72.9255 },
  { id: "hc-godrej-mem", category: "healthcare", name: "Godrej Memorial Hospital", meta: "0.8 KM · 3 min", lat: 19.1042, lng: 72.9277 },
  { id: "hc-sai", category: "healthcare", name: "Sai Hospital", meta: "0.2 KM · 2 min walk", lat: 19.1100, lng: 72.9275 },
  { id: "hc-atul", category: "healthcare", name: "Atul Lok Private Hospital", meta: "1.1 KM · 4 min", lat: 19.1023, lng: 72.9248 },
  { id: "hc-hiranandani", category: "healthcare", name: "Dr. L. H. Hiranandani Hospital", meta: "2.0 KM · 6 min", lat: 19.1202, lng: 72.9169 },
  { id: "hc-supreme", category: "healthcare", name: "Supreme Multi Speciality Hospital", meta: "1.7 KM · 5 min", lat: 19.0982, lng: 72.9235 },
  { id: "hc-parakh", category: "healthcare", name: "Parakh Hospital (Ghatkopar)", meta: "4.4 KM · 9 min", lat: 19.0845, lng: 72.9076 },

  // 4. Hospitality & Business Hotels
  { id: "hs-ibis", category: "hospitality", name: "ibis Mumbai Vikhroli (LBS Marg)", meta: "1.5 KM · 4 min", lat: 19.1203, lng: 72.9252 },
  { id: "hs-taj-trees", category: "hospitality", name: "Taj The Trees (Pirojshanagar)", meta: "1.6 KM · 4 min", lat: 19.0988, lng: 72.9275 },
  { id: "hs-meluha", category: "hospitality", name: "Meluha The Fern (Hiranandani Powai)", meta: "2.3 KM · 6 min", lat: 19.1178, lng: 72.9110 },

  // 5. Entertainment, Retail & Lifestyle
  { id: "en-rcity", category: "entertainment", name: "R City Mall (LBS Marg, Ghatkopar)", meta: "2.0 KM · 5 min", lat: 19.0997, lng: 72.9157 },
  { id: "en-naturebasket", category: "entertainment", name: "Nature's Basket (Powai)", meta: "2.6 KM · 7 min", lat: 19.1195, lng: 72.9095 },
  { id: "en-hiranandanidmart", category: "entertainment", name: "Hiranandani D-Mart (Powai)", meta: "2.8 KM · 7 min", lat: 19.1182, lng: 72.9078 },
  { id: "en-powaiplaza", category: "entertainment", name: "Powai Plaza (Central Avenue)", meta: "2.6 KM · 7 min", lat: 19.1229, lng: 72.9132 },
  { id: "en-phoenix", category: "entertainment", name: "Phoenix Marketcity (LBS Marg, Kurla)", meta: "6.0 KM · 12 min", lat: 19.0863, lng: 72.8892 },

  // 6. Existing Multi-Modal Connectivity
  { id: "ec-green4", category: "existingConnectivity", name: "Metro Line 4 (Surya Nagar Station)", meta: "0.2 KM · 2 min walk", lat: 19.1110, lng: 72.9262 },
  { id: "ec-vikhroli-stn", category: "existingConnectivity", name: "Vikhroli Railway Station", meta: "0.4 KM · 2 min", lat: 19.1123, lng: 72.9283 },
  { id: "ec-vikhroli-bridge", category: "existingConnectivity", name: "Vikhroli East-West Flyover", meta: "0.4 KM · 2 min", lat: 19.1115, lng: 72.9285 },
  { id: "ec-eeh", category: "existingConnectivity", name: "Eastern Express Highway (EEH)", meta: "1.6 KM · 3–4 min", lat: 19.1105, lng: 72.9375 },
  { id: "ec-jvlr", category: "existingConnectivity", name: "JVLR (Jogeshwari-Vikhroli Link Road)", meta: "2.2 KM · 5 min", lat: 19.1245, lng: 72.9250 },
  { id: "ec-blueline", category: "existingConnectivity", name: "Ghatkopar Metro Station (Line 1)", meta: "4.1 KM · 8 min", lat: 19.0863, lng: 72.9082 },
  { id: "ec-east-freeway", category: "existingConnectivity", name: "Eastern Freeway (South Mumbai direct)", meta: "8.4 KM · 12–14 min", lat: 19.0550, lng: 72.9050 },
  { id: "ec-sclr", category: "existingConnectivity", name: "SCLR (Santacruz-Chembur Link Road)", meta: "9.3 KM · 15 min", lat: 19.0740, lng: 72.8690 },
  { id: "ec-csmiat2", category: "existingConnectivity", name: "CSMIA T2 International Airport", meta: "7.4 KM · 15–18 min", lat: 19.1014, lng: 72.8726 },
  { id: "ec-weh", category: "existingConnectivity", name: "Western Express Highway (WEH)", meta: "9.3 KM · 18 min", lat: 19.1180, lng: 72.8580 },
  { id: "ec-t1", category: "existingConnectivity", name: "Domestic Airport Terminal 1", meta: "10.4 KM · 22 min", lat: 19.0896, lng: 72.8530 },
  { id: "ec-sionpanvel", category: "existingConnectivity", name: "Sion-Panvel Highway (Pune/Goa access)", meta: "13.6 KM · 20 min", lat: 19.0450, lng: 72.9980 },
  { id: "ec-nmia", category: "existingConnectivity", name: "Navi Mumbai International Airport (NMIA)", meta: "25.6 KM · 40–45 min", lat: 18.9914, lng: 73.0657 },

  // 7. Upcoming Transformational Infrastructure
  { id: "ui-green4", category: "upcomingInfrastructure", name: "Metro Line 4 (Wadala–Ghatkopar–Thane)", meta: "0.2 KM · Direct Access", lat: 19.1110, lng: 72.9262 },
  { id: "ui-pink6", category: "upcomingInfrastructure", name: "Metro Line 6 (Swami Samarth–Vikhroli)", meta: "2.8 KM · 5 min", lat: 19.1290, lng: 72.9280 },
  { id: "ui-magenta14", category: "upcomingInfrastructure", name: "Metro Line 14 (Vikhroli–Badlapur corridor)", meta: "0.7 KM · 2 min", lat: 19.1130, lng: 72.9295 },
  { id: "ui-90feet", category: "upcomingInfrastructure", name: "90 Feet DP Road (Vikhroli–Powai arterial)", meta: "1.1 KM · 3 min", lat: 19.1070, lng: 72.9180 },
  { id: "ui-kkv-bridge", category: "upcomingInfrastructure", name: "Kopar Khairane–Vikhroli Creek Bridge", meta: "8.1 KM · 10 min", lat: 19.1120, lng: 72.9850 },
  { id: "ui-gmlr", category: "upcomingInfrastructure", name: "Goregaon-Mulund Link Road (GMLR)", meta: "7.6 KM · 12 min", lat: 19.1620, lng: 72.9280 },
];
