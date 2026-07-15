const SF_CENTER: [number, number] = [37.7749, -122.4194];

const LOCATIONS: { name: string; lat: number; lng: number }[] = [
  { name: "Golden Gate Bridge", lat: 37.8199, lng: -122.4783 },
  { name: "Fisherman's Wharf", lat: 37.808, lng: -122.4177 },
  { name: "Union Square", lat: 37.7879, lng: -122.4074 },
  { name: "Mission District", lat: 37.7599, lng: -122.4148 },
  { name: "Castro", lat: 37.762, lng: -122.435 },
  { name: "Haight-Ashbury", lat: 37.7692, lng: -122.4469 },
  { name: "Chinatown", lat: 37.7941, lng: -122.4078 },
  { name: "North Beach", lat: 37.7999, lng: -122.4106 },
  { name: "Embarcadero", lat: 37.7936, lng: -122.3953 },
  { name: "Twin Peaks", lat: 37.7544, lng: -122.4477 },
  { name: "Golden Gate Park", lat: 37.7694, lng: -122.4862 },
  { name: "Presidio", lat: 37.7989, lng: -122.4582 },
  { name: "SOMA", lat: 37.7785, lng: -122.3963 },
  { name: "Pacific Heights", lat: 37.7925, lng: -122.4385 },
  { name: "Nob Hill", lat: 37.793, lng: -122.415 },
  { name: "Marina", lat: 37.803, lng: -122.436 },
  { name: "Sunset", lat: 37.7516, lng: -122.4856 },
  { name: "Richmond", lat: 37.7808, lng: -122.4722 },
  { name: "Alcatraz", lat: 37.8267, lng: -122.423 },
  { name: "Oracle Park", lat: 37.7786, lng: -122.3893 },
  { name: "Lands End", lat: 37.7845, lng: -122.5089 },
  { name: "Bay Bridge", lat: 37.7984, lng: -122.3778 },
  { name: "Ferry Building", lat: 37.7956, lng: -122.3936 },
  { name: "Japantown", lat: 37.7851, lng: -122.4297 },
  { name: "Civic Center", lat: 37.7793, lng: -122.4193 },
];

const CONTENTS = [
  "The fog is absolutely surreal today 🌁",
  "Best damn espresso I've had in years ☕",
  "Street art in the Mission is incredible 🎨",
  "Waiting for the cable car like it's 1890 🚋",
  "Sea lions are going OFF at Pier 39 🦭",
  "Sunset from Twin Peaks was unreal 🔥",
  "This burrito is life-changing 🌯",
  "Found a hidden speakeasy down this alley 🍸",
  "Dolphins in the bay today!! 🐬",
  "Golden Gate looking majestic through the fog ✨",
  "Jazz club on Fillmore is pure magic 🎷",
  "Farmers market has the best peaches 🍑",
  "Biking across the bridge is a must-do 🚲",
  "Painted Ladies in perfect golden hour light 📸",
  "Dim sum in Chinatown — 10/10 🥟",
  "Surfing at Ocean Beach — freezing but worth it 🏄",
  "Hiking in the Presidio feels like another world 🌲",
  "Bookstore on Valencia is a treasure trove 📚",
  "Garlic fries at the ballpark — yes please 🧄",
  "Alcatraz tour was hauntingly beautiful ⛓️",
  "Watching the ships come in at Fort Mason 🚢",
  "Lovers Lane at golden hour 💛",
  "Best sourdough bread in the city 🥖",
  "Running into old friends at the Ferry Building",
  "Tech bros taking over my favorite cafe 🙄",
  "Hot cider at the Japantown festival 🍎",
  "Murals all over Clarion Alley — go see them!",
  "The view from Coit Tower is worth the hike 🗼",
  "Sampling wine in Sonoma this weekend 🍷",
  "Neon signs in the Tenderloin at night 📸",
];

const AUTHORS = [
  { uid: "mock_user_id", name: "Mimo" },
  { uid: "author_a", name: "Maya Chen" },
  { uid: "author_b", name: "James Wilson" },
  { uid: "author_c", name: null },
  { uid: "author_d", name: "Samira Patel" },
  { uid: "author_e", name: "Alex Kim" },
  { uid: "author_f", name: null },
  { uid: "author_g", name: "Jordan Rivera" },
  { uid: "author_h", name: "Priya Sharma" },
];

let cachedStories: ReturnType<typeof generateAll> | null = null;

function generateAll(isGlobal: boolean) {
  const candidateLocations = isGlobal
    ? [...LOCATIONS, ...[
        { name: "Times Square", lat: 40.758, lng: -73.9855 },
        { name: "London Eye", lat: 51.5033, lng: -0.1196 },
        { name: "Tokyo Tower", lat: 35.6586, lng: 139.7454 },
        { name: "Sydney Opera House", lat: -33.8568, lng: 151.2153 },
        { name: "Eiffel Tower", lat: 48.8584, lng: 2.2945 },
        { name: "Copacabana", lat: -22.9711, lng: -43.1823 },
      ]]
    : LOCATIONS;

  const now = Date.now();
  const hoursAgo = (h: number) => now - h * 3600_000;

  return candidateLocations.map((loc, i) => {
    const author = AUTHORS[i % AUTHORS.length];
    const ageHours = ((i * 7) % 23) + 0.5;
    const createdAt = hoursAgo(ageHours);
    const expiresAt = createdAt + 24 * 3600_000;

    return {
      id: `mock_story_${i}`,
      content: CONTENTS[i % CONTENTS.length],
      location: { latitude: loc.lat, longitude: loc.lng },
      geohash: "",
      timezone: "America/Los_Angeles",
      createdAt: mockTimestamp(createdAt),
      expiresAt: mockTimestamp(expiresAt),
      authorId: author.uid,
      authorName: author.name,
      visibility: "public" as const,
      reports: 0,
    };
  });
}

export function generateMockStories(
  center: [number, number] | null,
  radiusKm: number,
) {
  const isGlobal = !center;
  if (!cachedStories) {
    cachedStories = generateAll(isGlobal);
  }
  return cachedStories;
}

function mockTimestamp(ms: number) {
  return {
    seconds: Math.floor(ms / 1000),
    nanoseconds: 0,
    toMillis: () => ms,
    toDate: () => new Date(ms),
  };
}

function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function filterMockStories(
  allStories: ReturnType<typeof generateMockStories>,
  center: [number, number] | null,
  radiusKm: number,
) {
  if (!center) return allStories;
  const [clat, clng] = center;
  return allStories
    .filter((s) => {
      const d = haversineKm(clat, clng, s.location.latitude, s.location.longitude);
      return d <= radiusKm;
    })
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export const MOCK_USER = {
  uid: "mock_user_id",
  email: "mimo@example.com",
  displayName: "Mimo",
  isAnonymous: false,
  photoURL: null,
  phoneNumber: null,
  providerId: "password",
  metadata: {},
  providerData: [],
  refreshToken: "",
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => "",
  getIdTokenResult: async () => ({ token: "", authTime: "", issuedAtTime: "", expirationTime: "", signInProvider: "", signInSecondFactor: "", claims: {} }),
  reload: async () => {},
  toJSON: () => ({}),
  emailVerified: false,
};
