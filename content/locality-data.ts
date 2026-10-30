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
// High-precision geographic anchor for The Eastern Chambers (Amber Compound, Plot No. 11A, LBS Marg, Surya Nagar, Vikhroli West)
export const PROJECT_CENTER = { lat: 19.1136, lng: 72.9272 };

export const CATEGORIES = {
  nearbyAreas: { label: "Nearby Areas", color: "#2563eb", icon: "🏙️" },
  businessParks: { label: "Business Parks", color: "#43297c", icon: "🏢" },
  healthcare: { label: "Healthcare", color: "#dc2626", icon: "🏥" },
  hospitality: { label: "Hospitality", color: "#ea580c", icon: "🏨" },
  entertainment: { label: "Entertainment", color: "#db2777", icon: "🛍️" },
  existingConnectivity: { label: "Existing Connectivity", color: "#0891b2", icon: "🚆" },
  upcomingInfrastructure: { label: "Upcoming Infrastructure", color: "#16a34a", icon: "🚀" },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const NODES: LocalityNode[] = [
  // 1. Nearby Areas
  { id: "near-powai", category: "nearbyAreas", name: "Powai (Hiranandani)", meta: "2.9 KM · 8 min", lat: 19.1197, lng: 72.9051 },
  { id: "near-kanjur", category: "nearbyAreas", name: "Kanjurmarg", meta: "3.1 KM · 6 min", lat: 19.1283, lng: 72.9275 },
  { id: "near-ghatkopar", category: "nearbyAreas", name: "Ghatkopar", meta: "4.2 KM · 8 min", lat: 19.0857, lng: 72.9081 },
  { id: "near-mulund", category: "nearbyAreas", name: "Mulund", meta: "10 KM · 15 min", lat: 19.1724, lng: 72.9565 },
  { id: "near-andheri", category: "nearbyAreas", name: "Andheri East (MIDC/SEEPZ)", meta: "10.9 KM · 20 min", lat: 19.1215, lng: 72.8725 },
  { id: "near-thane", category: "nearbyAreas", name: "Thane (Teen Hath Naka)", meta: "12.3 KM · 18 min", lat: 19.1889, lng: 72.9634 },
  { id: "near-bkc", category: "nearbyAreas", name: "BKC (Bandra Kurla Complex)", meta: "10 KM · 18 min", lat: 19.0672, lng: 72.8692 },
  { id: "near-navimumbai", category: "nearbyAreas", name: "Navi Mumbai (Airoli / Vashi)", meta: "11.1 KM · 20 min", lat: 19.0771, lng: 72.9986 },

  // 2. Business Parks & Corporate Hubs
  { id: "bp-91", category: "businessParks", name: "91springboard Vikhroli", meta: "0.1 KM · 1 min walk", lat: 19.1047, lng: 72.9225 },
  { id: "bp-embassy", category: "businessParks", name: "Embassy 247 Park (LBS Marg)", meta: "1.6 KM · 4 min", lat: 19.1189, lng: 72.9271 },
  { id: "bp-godrej-one", category: "businessParks", name: "Godrej One & The Trees", meta: "0.7 KM · 3 min", lat: 19.0948, lng: 72.9279 },
  { id: "bp-powai-supreme", category: "businessParks", name: "Supreme Business Park (Powai)", meta: "2.4 KM · 6 min", lat: 19.1154, lng: 72.9092 },
  { id: "bp-mapletree", category: "businessParks", name: "Hiranandani Business Park (Powai)", meta: "2.3 KM · 6 min", lat: 19.1185, lng: 72.9070 },
  { id: "bp-lodha", category: "businessParks", name: "Lodha Supremus (Kanjurmarg)", meta: "3.2 KM · 7 min", lat: 19.1289, lng: 72.9307 },
  { id: "bp-amani", category: "businessParks", name: "Amani Knowledge Park", meta: "0.5 KM · 2 min", lat: 19.1082, lng: 72.9248 },
  { id: "bp-mtc", category: "businessParks", name: "Mumbai Trade Centre (BKC)", meta: "10 KM · 18 min", lat: 19.0658, lng: 72.8662 },

  // 3. Healthcare Facilities
  { id: "hc-samarth", category: "healthcare", name: "Samarth Hospital (LBS Marg)", meta: "0.1 KM · 1 min walk", lat: 19.1092, lng: 72.9255 },
  { id: "hc-nursing", category: "healthcare", name: "Healthcare Nursing Home", meta: "0.9 KM · 3 min", lat: 19.1065, lng: 72.9242 },
  { id: "hc-godrej-mem", category: "healthcare", name: "Godrej Memorial Hospital", meta: "0.8 KM · 3 min", lat: 19.1045, lng: 72.9277 },
  { id: "hc-sai", category: "healthcare", name: "Sai Hospital", meta: "0.2 KM · 2 min walk", lat: 19.1128, lng: 72.9315 },
  { id: "hc-atul", category: "healthcare", name: "Atul Lok Private Hospital", meta: "1.1 KM · 4 min", lat: 19.1191, lng: 72.9344 },
  { id: "hc-hiranandani", category: "healthcare", name: "Dr. L. H. Hiranandani Hospital", meta: "2.0 KM · 6 min", lat: 19.1209, lng: 72.9168 },
  { id: "hc-supreme", category: "healthcare", name: "Supreme Multi Speciality Hospital", meta: "1.7 KM · 5 min", lat: 19.0915, lng: 72.9122 },
  { id: "hc-parakh", category: "healthcare", name: "Parakh Hospital (Ghatkopar)", meta: "4.4 KM · 9 min", lat: 19.0844, lng: 72.9075 },

  // 4. Hospitality & Business Hotels
  { id: "hs-ibis", category: "hospitality", name: "ibis Mumbai Vikhroli (LBS Marg)", meta: "1.5 KM · 4 min", lat: 19.1157, lng: 72.9277 },
  { id: "hs-taj-trees", category: "hospitality", name: "Taj The Trees (Pirojshanagar)", meta: "1.6 KM · 4 min", lat: 19.0942, lng: 72.9258 },
  { id: "hs-meluha", category: "hospitality", name: "Meluha The Fern (Hiranandani Powai)", meta: "2.3 KM · 6 min", lat: 19.1190, lng: 72.9055 },

  // 5. Entertainment, Retail & Lifestyle
  { id: "en-rcity", category: "entertainment", name: "R City Mall (LBS Marg, Ghatkopar)", meta: "2.0 KM · 5 min", lat: 19.0998, lng: 72.9165 },
  { id: "en-naturebasket", category: "entertainment", name: "Nature's Basket (Powai)", meta: "2.6 KM · 7 min", lat: 19.1170, lng: 72.9126 },
  { id: "en-hiranandanidmart", category: "entertainment", name: "Hiranandani D-Mart (Powai)", meta: "2.8 KM · 7 min", lat: 19.1163, lng: 72.9123 },
  { id: "en-powaiplaza", category: "entertainment", name: "Powai Plaza (Central Avenue)", meta: "2.6 KM · 7 min", lat: 19.1234, lng: 72.9131 },
  { id: "en-phoenix", category: "entertainment", name: "Phoenix Marketcity (LBS Marg, Kurla)", meta: "6.0 KM · 12 min", lat: 19.0863, lng: 72.8887 },

  // 6. Existing Multi-Modal Connectivity
  { id: "ec-green4", category: "existingConnectivity", name: "Metro Line 4 (Surya Nagar Station)", meta: "0.2 KM · 2 min walk", lat: 19.1142, lng: 72.9272 },
  { id: "ec-vikhroli-stn", category: "existingConnectivity", name: "Vikhroli Railway Station", meta: "0.4 KM · 2 min", lat: 19.1115, lng: 72.9282 },
  { id: "ec-vikhroli-bridge", category: "existingConnectivity", name: "Vikhroli East-West Flyover", meta: "0.4 KM · 2 min", lat: 19.1098, lng: 72.9275 },
  { id: "ec-eeh", category: "existingConnectivity", name: "Eastern Express Highway (EEH)", meta: "1.6 KM · 3–4 min", lat: 19.1110, lng: 72.9362 },
  { id: "ec-jvlr", category: "existingConnectivity", name: "JVLR (Jogeshwari-Vikhroli Link Road)", meta: "2.2 KM · 5 min", lat: 19.1232, lng: 72.9278 },
  { id: "ec-blueline", category: "existingConnectivity", name: "Ghatkopar Metro Station (Line 1)", meta: "4.1 KM · 8 min", lat: 19.0860, lng: 72.9082 },
  { id: "ec-east-freeway", category: "existingConnectivity", name: "Eastern Freeway (South Mumbai direct)", meta: "8.4 KM · 12–14 min", lat: 19.0652, lng: 72.9145 },
  { id: "ec-sclr", category: "existingConnectivity", name: "SCLR (Santacruz-Chembur Link Road)", meta: "9.3 KM · 15 min", lat: 19.0715, lng: 72.8885 },
  { id: "ec-csmiat2", category: "existingConnectivity", name: "CSMIA T2 International Airport", meta: "7.4 KM · 15–18 min", lat: 19.0999, lng: 72.8744 },
  { id: "ec-weh", category: "existingConnectivity", name: "Western Express Highway (WEH)", meta: "9.3 KM · 18 min", lat: 19.1158, lng: 72.8562 },
  { id: "ec-t1", category: "existingConnectivity", name: "Domestic Airport Terminal 1", meta: "10.4 KM · 22 min", lat: 19.0928, lng: 72.8546 },
  { id: "ec-sionpanvel", category: "existingConnectivity", name: "Sion-Panvel Highway (Pune/Goa access)", meta: "13.6 KM · 20 min", lat: 19.0450, lng: 72.9980 },
  { id: "ec-nmia", category: "existingConnectivity", name: "Navi Mumbai International Airport (NMIA)", meta: "25.6 KM · 40–45 min", lat: 18.9919, lng: 73.0617 },

  // 7. Upcoming Transformational Infrastructure
  { id: "ui-green4", category: "upcomingInfrastructure", name: "Metro Line 4 (Wadala–Ghatkopar–Thane)", meta: "0.2 KM · Direct Access", lat: 19.1055, lng: 72.9225 },
  { id: "ui-pink6", category: "upcomingInfrastructure", name: "Metro Line 6 (Swami Samarth–Vikhroli)", meta: "2.8 KM · 5 min", lat: 19.1235, lng: 72.9338 },
  { id: "ui-magenta14", category: "upcomingInfrastructure", name: "Metro Line 14 (Vikhroli–Badlapur corridor)", meta: "0.7 KM · 2 min", lat: 19.1230, lng: 72.9375 },
  { id: "ui-90feet", category: "upcomingInfrastructure", name: "90 Feet DP Road (Vikhroli–Powai arterial)", meta: "1.1 KM · 3 min", lat: 19.1135, lng: 72.9195 },
  { id: "ui-kkv-bridge", category: "upcomingInfrastructure", name: "Kopar Khairane–Vikhroli Creek Bridge", meta: "8.1 KM · 10 min", lat: 19.1125, lng: 72.9715 },
  { id: "ui-gmlr", category: "upcomingInfrastructure", name: "Goregaon-Mulund Link Road (GMLR)", meta: "7.6 KM · 12 min", lat: 19.1558, lng: 72.9385 },
];
