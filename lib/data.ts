import {
  Agent,
  District,
  Hotel,
  IndianState,
  MealSlot,
  PackageDay,
  Review,
  Spot,
  SpotType,
  TourPackage,
  Vehicle,
} from './types';
import { hashStr, mulberry32, shadeHex } from './utils';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const SP = (
  id: string,
  name: string,
  type: SpotType,
  lat: number,
  lng: number,
  blurb: string,
  bestTime: string,
  rating: number,
  entryFee: string,
  hours: string
): Spot => ({ id, name, type, lat, lng, blurb, bestTime, rating, entryFee, hours, hotels: [] });

const DI = (
  id: string,
  name: string,
  r: number,
  c: number,
  color: string,
  blurb: string,
  spots: Spot[]
): District => ({ id, name, grid: { r, c }, color, blurb, spots });

/* ------------------------------------------------------------------ */
/* States, districts, spots                                            */
/* ------------------------------------------------------------------ */

export const STATES: IndianState[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    grid: { r: 3, c: 1 },
    color: '#C4552D',
    tagline: 'Land of kings, forts & desert sunsets',
    bestSeason: 'Oct – Mar',
    seasonLabel: 'Winter',
    peakSeason: 'Nov – Feb',
    highlights: ['Forts & Palaces', 'Desert Safaris', 'Folk Culture'],
    available: true,
    districts: [
      DI('d-jaipur', 'Jaipur', 0, 0, shadeHex('#C4552D', -0.08), 'The Pink City — a crown of forts, havelis and vibrant bazaars.', [
        SP('s-hawa', 'Hawa Mahal', 'Heritage', 26.9239, 75.8267, 'The Palace of Winds, a five-storey pink sandstone façade with 953 jharokhas built for royal ladies to observe street life unseen.', 'Oct – Feb', 4.6, '₹50', '9:00 AM – 4:30 PM'),
        SP('s-amber', 'Amber Fort', 'Heritage', 26.9855, 75.8513, 'A majestic hill-fort palace blending Hindu and Mughal architecture, with the famed Sheesh Mahal mirror palace.', 'Oct – Mar', 4.7, '₹100', '8:00 AM – 5:30 PM'),
        SP('s-citypalace', 'City Palace', 'Heritage', 26.9259, 75.8237, 'A sprawling palace complex still home to the royal family, housing museums, courtyards and the Chandra Mahal.', 'Oct – Mar', 4.6, '₹200', '9:30 AM – 5:00 PM'),
      ]),
      DI('d-udaipur', 'Udaipur', 0, 1, shadeHex('#C4552D', 0.12), 'The City of Lakes — romantic palaces floating on shimmering water.', [
        SP('s-pichola', 'Lake Pichola', 'Nature', 24.575, 73.678, 'An artificial freshwater lake framed by palaces, ghats and the Aravalli hills — best experienced on a sunset boat ride.', 'Oct – Mar', 4.7, 'Boat ₹400', '6:00 AM – 8:00 PM'),
        SP('s-ucitypalace', 'City Palace Udaipur', 'Heritage', 24.5765, 73.676, 'The largest palace in Rajasthan, a fusion of Mughal and Rajasthani styles overlooking Lake Pichola.', 'Oct – Mar', 4.7, '₹300', '9:30 AM – 5:30 PM'),
        SP('s-jagmandir', 'Jag Mandir', 'Heritage', 24.566, 73.673, 'A three-storeyed marble island palace on Lake Pichola, once a royal summer retreat and party venue.', 'Oct – Mar', 4.6, '₹350', '9:00 AM – 6:00 PM'),
      ]),
      DI('d-jodhpur', 'Jodhpur', 0, 2, shadeHex('#C4552D', 0.24), 'The Blue City — indigo houses beneath an impregnable fort.', [
        SP('s-mehrangarh', 'Mehrangarh Fort', 'Heritage', 26.2879, 73.0216, 'One of India’s largest forts, rising 125 m above the city with museum galleries of palanquins, arms and royal costumes.', 'Oct – Mar', 4.8, '₹100', '9:00 AM – 5:00 PM'),
        SP('s-umaid', 'Umaid Bhawan Palace', 'Heritage', 26.256, 73.006, 'A 1930s Art Deco marvel of golden sandstone, part luxury hotel, part royal residence, part museum.', 'Oct – Mar', 4.7, '₹300', '9:00 AM – 6:00 PM'),
        SP('s-jaswant', 'Jaswant Thada', 'Heritage', 26.293, 73.024, 'A white marble cenotaph built in memory of Maharaja Jaswant Singh II, glowing warmly at sunrise.', 'Oct – Mar', 4.6, '₹30', '9:00 AM – 5:00 PM'),
      ]),
    ],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    grid: { r: 7, c: 2 },
    color: '#1E7A5A',
    tagline: 'God’s Own Country — backwaters, spice hills & beaches',
    bestSeason: 'Oct – Mar',
    seasonLabel: 'Winter',
    peakSeason: 'Dec – Feb',
    highlights: ['Backwaters', 'Tea Plantations', 'Ayurveda'],
    available: true,
    districts: [
      DI('d-ernakulam', 'Ernakulam (Kochi)', 0, 0, shadeHex('#1E7A5A', -0.06), 'Queen of the Arabian Sea — a historic spice-trade port.', [
        SP('s-fortkochi', 'Fort Kochi Beach', 'Beach', 9.9319, 76.243, 'A historic beach where Chinese fishing nets still draw the evening catch, backed by colonial-era bungalows and galleries.', 'Oct – Mar', 4.5, 'Free', 'Open 24 hrs'),
        SP('s-mattancherry', 'Mattancherry Palace', 'Heritage', 9.94, 76.246, 'A 1555 Portuguese-Dutch palace gifted to the Maharaja of Cochin, famed for its murals of the Ramayana.', 'Oct – Mar', 4.4, '₹25', '10:00 AM – 5:00 PM'),
        SP('s-marinedrive', 'Marine Drive', 'City', 9.935, 76.267, 'A picturesque promenade along the backwaters, lined with shopping centres and best enjoyed at sunset.', 'Oct – Mar', 4.3, 'Free', 'Open 24 hrs'),
      ]),
      DI('d-idukki', 'Idukki (Munnar)', 0, 1, shadeHex('#1E7A5A', 0.14), 'Mist-clad tea gardens and cool mountain air.', [
        SP('s-teagardens', 'Munnar Tea Gardens', 'Nature', 10.089, 77.064, 'Rolling emerald estates of the Kannan Devan hills, where tea pluckers work the misty slopes at dawn.', 'Oct – Feb', 4.7, 'Free', 'Open 24 hrs'),
        SP('s-eravikulam', 'Eravikulam National Park', 'Wildlife', 10.168, 77.033, 'Home to the endangered Nilgiri tahr and the blooming Neelakurinji hills every twelve years.', 'Sep – May', 4.6, '₹50', '7:00 AM – 5:00 PM'),
        SP('s-mattupetty', 'Mattupetty Dam', 'Nature', 10.095, 77.053, 'A concrete gravity dam set at 1,700 m with boating on its still reservoir and views of the tea country.', 'Oct – Mar', 4.4, '₹10', '9:00 AM – 5:00 PM'),
      ]),
      DI('d-trivandrum', 'Thiruvananthapuram', 0, 2, shadeHex('#1E7A5A', 0.26), 'The ancient capital — temples, museums and southern beaches.', [
        SP('s-padmanabhaswamy', 'Padmanabhaswamy Temple', 'Spiritual', 8.51, 76.95, 'A 1,000-year-old temple dedicated to Lord Vishnu, famed for its Dravidian architecture and legendary vaults.', 'Oct – Mar', 4.7, 'Free', '4:30 AM – 7:00 PM'),
        SP('s-kovalam', 'Kovalam Beach', 'Beach', 8.4, 77.033, 'A crescent of golden sand split by rocky headlands, loved for sunsets, surfing and Ayurveda retreats.', 'Oct – Mar', 4.5, 'Free', 'Open 24 hrs'),
        SP('s-napier', 'Napier Museum', 'Heritage', 8.518, 76.955, 'A 19th-century Indo-Saracenic museum housing bronze idols, ivory carvings and royal curios.', 'Oct – Mar', 4.3, '₹20', '10:00 AM – 5:00 PM'),
      ]),
    ],
  },
  {
    id: 'goa',
    name: 'Goa',
    grid: { r: 6, c: 1 },
    color: '#2E86AB',
    tagline: 'Sun, sand, spice markets & Latin quarters',
    bestSeason: 'Nov – Feb',
    seasonLabel: 'Winter',
    peakSeason: 'Dec – Jan',
    highlights: ['Beaches', 'Nightlife', 'Portuguese Heritage'],
    available: true,
    districts: [
      DI('d-northgoa', 'North Goa', 0, 0, shadeHex('#2E86AB', -0.05), 'The vibrant coast — beach shacks, flea markets and sunsets.', [
        SP('s-baga', 'Baga Beach', 'Beach', 15.552, 73.747, 'Goa’s most famous beach — a crescent of golden sand lined with shacks, water sports and nightlife.', 'Nov – Feb', 4.4, 'Free', 'Open 24 hrs'),
        SP('s-aguada', 'Fort Aguada', 'Heritage', 15.493, 73.772, 'A 17th-century Portuguese fort guarding the Mandovi estuary, with a lighthouse and panoramic sea views.', 'Oct – Mar', 4.5, 'Free', '9:00 AM – 6:00 PM'),
        SP('s-anjuna', 'Anjuna Flea Market', 'City', 15.573, 73.742, 'A bohemian Wednesday market of trinkets, spices, hammocks and live music since the 1960s.', 'Nov – Feb', 4.3, 'Free', 'Wednesdays 9 AM – 6 PM'),
      ]),
      DI('d-southgoa', 'South Goa', 0, 1, shadeHex('#2E86AB', 0.15), 'The quieter coast — pristine sands, churches and wildlife.', [
        SP('s-palolem', 'Palolem Beach', 'Beach', 15.013, 74.028, 'A crescent-shaped bay fringed with coconut palms, voted among Asia’s best beaches for its calm waters.', 'Nov – Feb', 4.6, 'Free', 'Open 24 hrs'),
        SP('s-dudhsagar', 'Dudhsagar Falls', 'Nature', 15.335, 74.32, 'A four-tiered, 310 m waterfall known as the Sea of Milk, thundering through the Western Ghats in monsoon.', 'Oct – Feb', 4.7, '₹200', '8:00 AM – 6:00 PM'),
        SP('s-bomjesus', 'Basilica of Bom Jesus', 'Heritage', 15.298, 73.918, 'A UNESCO World Heritage baroque church holding the sacred relics of St Francis Xavier.', 'Oct – Mar', 4.6, 'Free', '8:30 AM – 6:30 PM'),
      ]),
    ],
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    grid: { r: 1, c: 4 },
    color: '#6A8EAE',
    tagline: 'The Devbhoomi — Himalayan peaks, rivers & shrines',
    bestSeason: 'Mar – Jun, Sep – Nov',
    seasonLabel: 'Spring & Autumn',
    peakSeason: 'May – Jun',
    highlights: ['Trekking', 'Char Dham', 'River Rafting'],
    available: true,
    districts: [
      DI('d-dehradun', 'Dehradun', 0, 0, shadeHex('#6A8EAE', -0.05), 'The Doon Valley — schools, forests and rivers between the Shivaliks.', [
        SP('s-robberscave', 'Robber’s Cave (Gucchupani)', 'Nature', 30.287, 78.107, 'A river cave formation where the stream disappears underground — wade through knee-deep cold water.', 'Mar – Jun', 4.3, '₹25', '8:00 AM – 6:00 PM'),
        SP('s-mindrolling', 'Mindrolling Monastery', 'Spiritual', 30.293, 78.068, 'One of the largest Buddhist centres in India, with a 60 m stupa and serene gardens.', 'Year-round', 4.6, 'Free', '9:00 AM – 7:00 PM'),
        SP('s-fri', 'Forest Research Institute', 'Heritage', 30.333, 78.04, 'A colonial-era Greco-Roman institute set in 450 hectares of deodar forest, with museums and a botanical garden.', 'Year-round', 4.5, '₹40', '9:30 AM – 5:00 PM'),
      ]),
      DI('d-nainital', 'Nainital', 0, 1, shadeHex('#6A8EAE', 0.12), 'The Lake District of India — a Victorian hill station around a glacial lake.', [
        SP('s-nainilake', 'Naini Lake', 'Nature', 29.395, 79.445, 'A crescent-shaped lake ringed by hills, best enjoyed by paddle-boat with views of the snow-capped Kumaon peaks.', 'Mar – Jun, Oct – Nov', 4.5, 'Boat ₹160', '9:00 AM – 6:00 PM'),
        SP('s-nainadevi', 'Naina Devi Temple', 'Spiritual', 29.396, 79.446, 'A revered Shakti Peetha on the lake’s northern shore, glowing with oil lamps at evening aarti.', 'Year-round', 4.6, 'Free', '6:00 AM – 10:00 PM'),
        SP('s-snowview', 'Snow View Point', 'Nature', 29.41, 79.46, 'A panoramic viewpoint at 2,270 m reached by cable car, framing the Nanda Devi range.', 'Oct – Jun', 4.4, '₹10 + ropeway ₹300', '10:00 AM – 5:30 PM'),
      ]),
      DI('d-chamoli', 'Chamoli (Badrinath & Auli)', 0, 2, shadeHex('#6A8EAE', 0.24), 'High Himalayan shrines and India’s premier ski slopes.', [
        SP('s-badrinath', 'Badrinath Temple', 'Spiritual', 30.735, 79.487, 'One of the Char Dham shrines, dedicated to Lord Vishnu, set between the Nar and Narayan peaks on the Alaknanda.', 'May – Oct', 4.8, 'Free', '4:30 AM – 9:00 PM'),
        SP('s-auli', 'Auli Meadows', 'Adventure', 30.62, 79.4, 'India’s skiing capital — rolling alpine meadows and a 3 km gondola with views of Nanda Devi and Mana Parbat.', 'Dec – Mar (ski), May – Oct (treks)', 4.7, 'Gondola ₹350', '8:30 AM – 5:00 PM'),
        SP('s-valleyflowers', 'Valley of Flowers', 'Nature', 30.72, 79.66, 'A UNESCO World Heritage alpine valley that blooms with 600+ flower species each monsoon, home to the blue brahmakamal.', 'Jul – Sep', 4.9, '₹150 + permit ₹100', '7:00 AM – 5:00 PM'),
      ]),
    ],
  },
  {
    id: 'himachal',
    name: 'Himachal Pradesh',
    grid: { r: 1, c: 2 },
    color: '#7D5BA6',
    tagline: 'Devbhoomi of the Himalayas — valleys, monasteries & paragliding',
    bestSeason: 'Mar – Jun, Oct – Nov',
    seasonLabel: 'Spring & Autumn',
    peakSeason: 'May – Jun',
    highlights: ['Hill Stations', 'Adventure Sports', 'Tibetan Culture'],
    available: true,
    districts: [
      DI('d-shimla', 'Shimla', 0, 0, shadeHex('#7D5BA6', -0.05), 'The Queen of Hills — a former summer capital on the Kalka–Shimla railway.', [
        SP('s-mallroad', 'The Mall Road', 'City', 31.101, 77.174, 'Shimla’s bustling promenade of colonial shops, bakeries and the iconic Gaiety Theatre.', 'Year-round', 4.3, 'Free', 'Open 24 hrs'),
        SP('s-jakhu', 'Jakhu Temple', 'Spiritual', 31.095, 77.17, 'An ancient Hanuman temple atop Jakhu Hill at 2,455 m, guarded by friendly monkeys and a 33 m statue.', 'Year-round', 4.5, 'Free', '6:00 AM – 8:00 PM'),
        SP('s-ridge', 'The Ridge', 'City', 31.101, 77.175, 'A large open gathering place with views of the snow-capped peaks, Christ Church and the old Scandal Point.', 'Year-round', 4.3, 'Free', 'Open 24 hrs'),
      ]),
      DI('d-kullu', 'Kullu (Manali)', 0, 1, shadeHex('#7D5BA6', 0.12), 'The Valley of Gods — cedar forests, rivers and adventure.', [
        SP('s-hadimba', 'Hadimba Temple', 'Heritage', 32.24, 77.19, 'A 1553 wooden pagoda temple dedicated to Hidimba Devi, set in a cedar forest near Manali’s old town.', 'Year-round', 4.5, '₹50', '8:00 AM – 6:00 PM'),
        SP('s-solang', 'Solang Valley', 'Adventure', 32.31, 77.14, 'A meadow valley 14 km from Manali offering paragliding, zorbing, skiing and cable cars against the Pir Panjal.', 'May – Oct (adventure), Dec – Feb (ski)', 4.4, 'Free (activities ₹500+)', '9:00 AM – 6:00 PM'),
        SP('s-rohtang', 'Rohtang Pass', 'Adventure', 32.38, 77.2, 'A high mountain pass at 3,978 m linking Kullu with Lahaul — snow games in summer, closed in winter.', 'May – Oct', 4.5, 'Permit ₹200', '6:00 AM – 6:00 PM'),
      ]),
      DI('d-kangra', 'Kangra (Dharamshala)', 0, 2, shadeHex('#7D5BA6', 0.24), 'The home of Tibetan culture in exile and the Dhauladhar range.', [
        SP('s-bhagsunag', 'Bhagsunag Temple & Falls', 'Nature', 32.25, 76.26, 'An ancient Shiva temple beside a 20 m waterfall, a short trek from McLeod Ganj’s busy streets.', 'Mar – Jun, Sep – Nov', 4.4, 'Free', '6:00 AM – 7:00 PM'),
        SP('s-namgyal', 'Namgyal Monastery', 'Spiritual', 32.21, 76.25, 'The personal monastery of the Dalai Lama, where monks chant and debate in the serene courtyard.', 'Year-round', 4.6, 'Free', '7:00 AM – 7:00 PM'),
        SP('s-triund', 'Triund Hill', 'Adventure', 32.27, 76.28, 'A 12 km trek through rhododendron forest to a meadow with sweeping views of the Kangra valley and snow peaks.', 'Mar – Jun, Sep – Nov', 4.7, 'Free', 'Best 6 AM – 4 PM'),
      ]),
    ],
  },
  {
    id: 'tamilnadu',
    name: 'Tamil Nadu',
    grid: { r: 7, c: 3 },
    color: '#D4A017',
    tagline: 'Land of temples, silk sarees and filter coffee',
    bestSeason: 'Oct – Mar',
    seasonLabel: 'Winter',
    peakSeason: 'Nov – Feb',
    highlights: ['Dravidian Temples', 'Hill Stations', 'Cuisine'],
    available: true,
    districts: [
      DI('d-chennai', 'Chennai', 0, 0, shadeHex('#D4A017', -0.05), 'The Gateway to South India — temples, beaches and Carnatic music.', [
        SP('s-marina', 'Marina Beach', 'Beach', 13.05, 80.28, 'The second-longest urban beach in the world, alive with cricket, vendors and dramatic sunsets over the Bay of Bengal.', 'Oct – Feb', 4.3, 'Free', 'Open 24 hrs'),
        SP('s-fortstgeorge', 'Fort St George', 'Heritage', 13.083, 80.29, 'The first English fortress in India (1644), now the seat of Tamil Nadu’s government and a fine museum.', 'Year-round', 4.4, '₹25', '9:00 AM – 5:00 PM'),
        SP('s-kapaleeshwarar', 'Kapaleeshwarar Temple', 'Spiritual', 13.033, 80.27, 'A 7th-century Dravidian temple in Mylapore with a 37 m gopuram carved with Hindu legends.', 'Year-round', 4.6, 'Free', '6:00 AM – 9:00 PM'),
      ]),
      DI('d-nilgiris', 'Nilgiris (Ooty & Coonoor)', 0, 1, shadeHex('#D4A017', 0.12), 'The Blue Mountains — tea country, toy trains and cool mist.', [
        SP('s-ootylake', 'Ooty Lake', 'Nature', 11.41, 76.7, 'A 65-acre artificial lake surrounded by eucalyptus groves, offering boating and pony rides.', 'Oct – Jun', 4.4, 'Entry ₹10, Boating ₹140', '9:00 AM – 6:00 PM'),
        SP('s-doddabetta', 'Doddabetta Peak', 'Nature', 11.37, 76.72, 'The highest peak in the Nilgiris at 2,637 m, with a telescope house and panoramic views of the plains.', 'Year-round', 4.5, '₹15', '9:00 AM – 6:00 PM'),
        SP('s-botanical', 'Botanical Garden', 'Nature', 11.41, 76.71, 'A 22-hectare garden founded in 1848, home to a 20-million-year-old fossilised tree and a summer festival.', 'Year-round', 4.4, '₹30', '9:00 AM – 6:00 PM'),
      ]),
      DI('d-madurai', 'Madurai', 0, 2, shadeHex('#D4A017', 0.24), 'The Temple City — 2,500 years of Pandyan heritage and jasmine.', [
        SP('s-meenakshi', 'Meenakshi Amman Temple', 'Spiritual', 9.918, 78.12, 'A vast Dravidian complex with 14 colourful gopurams, dedicated to Goddess Meenakshi and Lord Sundareswarar.', 'Year-round', 4.8, 'Free (₹50 special entry)', '5:00 AM – 10:00 PM'),
        SP('s-thirumalai', 'Thirumalai Nayakkar Palace', 'Heritage', 9.92, 78.12, 'A 17th-century Indo-Saracenic palace with massive pillars and a sound-and-light show each evening.', 'Year-round', 4.5, '₹30', '9:00 AM – 5:00 PM'),
        SP('s-gandhi', 'Gandhi Memorial Museum', 'Heritage', 9.93, 78.11, 'One of India’s five Gandhi museums, housed in the Tamukkam Palace with relics and a picture gallery.', 'Year-round', 4.3, '₹10', '10:00 AM – 1:00 PM, 2:00 – 5:45 PM'),
      ]),
    ],
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    grid: { r: 6, c: 2 },
    color: '#2D6A4F',
    tagline: 'From Hampi’s ruins to Coorg’s coffee hills',
    bestSeason: 'Oct – Mar',
    seasonLabel: 'Winter',
    peakSeason: 'Oct – Dec',
    highlights: ['UNESCO Ruins', 'Wildlife', 'Coffee Estates'],
    available: true,
    districts: [
      DI('d-bengaluru', 'Bengaluru (Bangalore)', 0, 0, shadeHex('#2D6A4F', -0.05), 'The Garden City — parks, pubs and a 400-year-old fort.', [
        SP('s-lalbagh', 'Lalbagh Botanical Garden', 'Nature', 12.95, 76.58, 'A 240-acre Mughal-style garden with a glass house, ancient trees and a popular flower show every Republic Day.', 'Year-round', 4.4, '₹25', '6:00 AM – 7:00 PM'),
        SP('s-cubbon', 'Cubbon Park', 'Nature', 12.976, 76.59, 'A 300-acre green lung in the heart of the city, dotted with statues, a aquarium and colonial buildings.', 'Year-round', 4.3, 'Free', '6:00 AM – 9:00 PM'),
        SP('s-nandihills', 'Nandi Hills', 'Nature', 13.37, 77.68, 'A 1,478 m hill fortress 60 km away, famous for sunrise views, cycling trails and the Yoga Nandeeshwara temple.', 'Sep – Feb', 4.5, '₹20', '6:00 AM – 7:00 PM'),
      ]),
      DI('d-mysuru', 'Mysuru (Mysore)', 0, 1, shadeHex('#2D6A4F', 0.12), 'The City of Palaces — Dasara grandeur and silk sarees.', [
        SP('s-mysorepalace', 'Mysore Palace', 'Heritage', 12.305, 76.655, 'The official residence of the Wadiyars, an Indo-Saracenic marvel illuminated by 100,000 bulbs on Sundays.', 'Oct – Mar', 4.7, '₹70', '10:00 AM – 5:30 PM'),
        SP('s-chamundi', 'Chamundi Hill', 'Hill', 12.27, 76.66, 'A 1,000 m hill crowned by the Chamundeshwari Temple, with a monolithic Nandi bull and city views.', 'Oct – Mar', 4.6, '₹30', '7:30 AM – 9:00 PM'),
        SP('s-brindavan', 'Brindavan Gardens', 'Nature', 12.4, 76.6, 'A 60-acre Mughal-style garden below the KRS dam, with musical fountains and illuminated terraces.', 'Oct – Mar', 4.4, '₹20', '6:00 AM – 9:00 PM'),
      ]),
      DI('d-vijayanagara', 'Vijayanagara (Hampi)', 0, 2, shadeHex('#2D6A4F', 0.24), 'A UNESCO World Heritage ruin of the last great Hindu kingdom.', [
        SP('s-virupaksha', 'Virupaksha Temple', 'Spiritual', 15.335, 76.46, 'A 7th-century living temple on the Tungabhadra river, the spiritual heart of the Vijayanagara empire.', 'Year-round', 4.7, '₹50', '9:00 AM – 1:00 PM, 3:00 – 9:00 PM'),
        SP('s-vittala', 'Vittala Temple', 'Heritage', 15.335, 76.445, 'Famed for its stone chariot and musical pillars that ring like instruments when tapped.', 'Year-round', 4.8, '₹50', '9:00 AM – 6:00 PM'),
        SP('s-matanga', 'Matanga Hill', 'Nature', 15.34, 76.455, 'A 30-minute climb to the highest point in Hampi, rewarded with a legendary sunset over the boulder-strewn landscape.', 'Oct – Feb', 4.6, 'Free', 'Best at sunset'),
      ]),
    ],
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    grid: { r: 5, c: 1 },
    color: '#9C6644',
    tagline: 'From Mumbai’s pulse to hill forts and vineyards',
    bestSeason: 'Oct – Feb',
    seasonLabel: 'Winter',
    peakSeason: 'Nov – Feb',
    highlights: ['Metropolis', 'Hill Forts', 'Caves & Wine'],
    available: true,
    districts: [
      DI('d-mumbai', 'Mumbai', 0, 0, shadeHex('#9C6644', -0.05), 'The Maximum City — Bollywood, bazaars and the Gateway of India.', [
        SP('s-gateway', 'Gateway of India', 'Heritage', 18.922, 72.835, 'An arch-monument built for King George V’s 1911 visit, overlooking the Arabian Sea and Elephanta ferries.', 'Oct – Mar', 4.6, 'Free', 'Open 24 hrs'),
        SP('s-marinedrive', 'Marine Drive', 'City', 18.94, 72.82, 'The Queen’s Necklace — a 3.6 km curved boulevard of Art Deco buildings and glittering evening lights.', 'Year-round', 4.5, 'Free', 'Open 24 hrs'),
        SP('s-elephanta', 'Elephanta Caves', 'Heritage', 18.96, 72.93, 'A UNESCO island of 5th–7th century rock-cut caves crowned by a 7 m Trimurti Shiva sculpture.', 'Oct – Mar', 4.6, '₹40 + ferry ₹200', '9:00 AM – 5:30 PM'),
      ]),
      DI('d-pune', 'Pune', 0, 1, shadeHex('#9C6644', 0.12), 'The Oxford of the East — history, hills and fine weather.', [
        SP('s-shaniwarwada', 'Shaniwar Wada', 'Heritage', 18.53, 73.86, 'An 18th-century Maratha fort-palace of the Peshwas, famed for its gates and the legendary Shaniwarwada fort.', 'Year-round', 4.5, '₹25', '9:00 AM – 6:00 PM'),
        SP('s-aga', 'Aga Khan Palace', 'Heritage', 18.55, 73.9, 'A 1892 Italianate palace where Gandhi was interned in 1942, now a memorial with his ashes and photographs.', 'Year-round', 4.4, '₹25', '9:00 AM – 5:30 PM'),
        SP('s-sinhagad', 'Sinhagad Fort', 'Adventure', 18.45, 73.75, 'A 17th-century hill fort 30 km away, best reached by a scenic trek and rewarded with Panshet lake views.', 'Jun – Feb', 4.5, '₹50', '9:00 AM – 6:00 PM'),
      ]),
      DI('d-nashik', 'Nashik', 0, 2, shadeHex('#9C6644', 0.24), 'The wine capital — sacred Godavari ghats and vineyards.', [
        SP('s-trimbakeshwar', 'Trimbakeshwar Temple', 'Spiritual', 19.99, 73.52, 'One of the 12 Jyotirlingas, where the Godavari river originates at the Brahmagiri hills.', 'Year-round', 4.7, 'Free', '6:00 AM – 9:00 PM'),
        SP('s-sula', 'Sula Vineyards', 'Nature', 20.01, 73.66, 'India’s pioneering winery — tastings of Chenin Blanc and Shiraz amid the Sahyadri foothills.', 'Year-round', 4.6, 'Tasting ₹500', '11:00 AM – 7:00 PM'),
        SP('s-pandavleni', 'Pandavleni Caves', 'Heritage', 19.99, 73.78, 'A group of 24 Buddhist caves from the 1st century BCE with chaityas and viharas carved into Trirashmi hill.', 'Year-round', 4.4, '₹25', '9:00 AM – 5:00 PM'),
      ]),
    ],
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    grid: { r: 4, c: 0 },
    color: '#E07A5F',
    tagline: 'Asiatic lions, stepwells and the Rann of Kutch',
    bestSeason: 'Oct – Mar',
    seasonLabel: 'Winter',
    peakSeason: 'Nov – Feb',
    highlights: ['Wildlife', 'Stepwells', 'Kutch Crafts'],
    available: true,
    districts: [
      DI('d-ahmedabad', 'Ahmedabad', 0, 0, shadeHex('#E07A5F', -0.05), 'India’s first UNESCO World Heritage City — pols, stepwells and Gandhi’s ashram.', [
        SP('s-sabarmati', 'Sabarmati Ashram', 'Heritage', 23.06, 72.58, 'Gandhi’s 1917 base on the Sabarmati river, where the Dandi March began; now a museum of his life.', 'Year-round', 4.7, 'Free', '8:00 AM – 7:00 PM'),
        SP('s-adalaj', 'Adalaj Stepwell', 'Heritage', 23.17, 72.51, 'A five-storey 15th-century stepwell with intricate carvings, built in memory of a Solanki queen.', 'Year-round', 4.6, '₹30', '9:00 AM – 6:00 PM'),
        SP('s-sidisaqqed', 'Sidi Saiyyed Mosque', 'Heritage', 23.02, 72.57, 'A 16th-century mosque famed for its jali windows — the Tree of Life lattice is Ahmedabad’s icon.', 'Year-round', 4.5, 'Free', '7:00 AM – 6:00 PM'),
      ]),
      DI('d-vadodara', 'Vadodara', 0, 1, shadeHex('#E07A5F', 0.12), 'The cultural capital — palaces, museums and the Champaner ruins.', [
        SP('s-laxmivilas', 'Laxmi Vilas Palace', 'Heritage', 22.31, 73.13, 'A 1890 Indo-Saracenic palace four times the size of Buckingham, residence of the Gaekwads of Baroda.', 'Year-round', 4.6, '₹150', '9:30 AM – 5:00 PM'),
        SP('s-sayajibaug', 'Sayaji Baug', 'Nature', 22.29, 73.18, 'A 113-acre garden gifted by Maharaja Sayajirao, with a zoo, museum and a toy train.', 'Year-round', 4.4, 'Free', '6:00 AM – 10:00 PM'),
        SP('s-champaner', 'Champaner-Pavagadh', 'Heritage', 22.47, 73.53, 'A UNESCO site of a 16th-century abandoned city and the Kalika Mata hill temple.', 'Oct – Mar', 4.7, '₹25', '9:00 AM – 5:00 PM'),
      ]),
      DI('d-dwarka', 'Dwarka', 0, 2, shadeHex('#E07A5F', 0.24), 'One of the Chardhams — Krishna’s legendary sunken city.', [
        SP('s-dwarkadhish', 'Dwarkadhish Temple', 'Spiritual', 22.245, 68.968, 'A 2,500-year-old five-storey temple dedicated to Krishna, with a 78 m spire and a flag changed five times daily.', 'Oct – Mar', 4.8, 'Free', '6:00 AM – 1:00 PM, 5:00 – 9:30 PM'),
        SP('s-betdwarka', 'Bet Dwarka', 'Nature', 22.29, 68.97, 'An island 2 km offshore believed to be Krishna’s residence, reached by ferry with beaches and a temple.', 'Oct – Mar', 4.5, 'Ferry ₹50', '8:00 AM – 6:00 PM'),
        SP('s-gomtighat', 'Gomti Ghat', 'Spiritual', 22.246, 68.967, 'A sacred ghat on the Gomti river where pilgrims take a dip before visiting the Dwarkadhish temple.', 'Year-round', 4.4, 'Free', 'Open 24 hrs'),
      ]),
    ],
  },
  {
    id: 'westbengal',
    name: 'West Bengal',
    grid: { r: 3, c: 6 },
    color: '#3D5A80',
    tagline: 'Durga Puja, Darjeeling tea and the Sundarbans',
    bestSeason: 'Oct – Mar',
    seasonLabel: 'Winter',
    peakSeason: 'Oct – Dec',
    highlights: ['Tea Gardens', 'Heritage', 'Sundarbans'],
    available: true,
    districts: [
      DI('d-kolkata', 'Kolkata', 0, 0, shadeHex('#3D5A80', -0.05), 'The City of Joy — colonial heritage, adda and rasgulla.', [
        SP('s-victoria', 'Victoria Memorial', 'Heritage', 22.544, 88.342, 'A white marble monument to Queen Victoria, set in 64 acres with a museum of colonial-era art.', 'Oct – Mar', 4.7, '₹30', '10:00 AM – 5:00 PM'),
        SP('s-howrahbridge', 'Howrah Bridge', 'Heritage', 22.585, 88.347, 'The 705 m cantilever bridge carrying 100,000 vehicles daily over the Hooghly — an engineering icon.', 'Year-round', 4.6, 'Free', 'Open 24 hrs'),
        SP('s-dakshineswar', 'Dakshineswar Temple', 'Spiritual', 22.65, 88.35, 'A 19th-century Kali temple where Ramakrishna Paramhansa meditated, on the Hooghly’s banks.', 'Year-round', 4.7, 'Free', '6:00 AM – 10:30 PM'),
      ]),
      DI('d-darjeeling', 'Darjeeling', 0, 1, shadeHex('#3D5A80', 0.12), 'The Queen of Hills — toy trains, tea and Kanchenjunga views.', [
        SP('s-tigerhill', 'Tiger Hill', 'Nature', 27.11, 88.16, 'A 2,590 m viewpoint where dawn breaks over Kanchenjunga, Everest and the sleeping Buddha mountain.', 'Oct – Mar', 4.7, '₹100', '4:30 AM – 6:00 PM'),
        SP('s-batasia', 'Batasia Loop', 'Nature', 27.07, 88.15, 'A spiral railway loop with a war memorial and a gompa, offering 360° views of the tea-covered hills.', 'Year-round', 4.5, '₹20', '9:00 AM – 5:00 PM'),
        SP('s-teagardens', 'Tea Gardens', 'Nature', 27.1, 88.18, 'Pluck a leaf at Happy Valley or Glenburn — estates producing the world’s finest second-flush Darjeeling.', 'Mar – Nov', 4.6, 'Tour ₹800', '9:00 AM – 5:00 PM'),
      ]),
      DI('d-kalimpong', 'Kalimpong', 0, 2, shadeHex('#3D5A80', 0.24), 'A quiet hill town of monasteries, nurseries and mountain views.', [
        SP('s-deolo', 'Deolo Hill', 'Nature', 27.07, 88.47, 'The highest point in Kalimpong at 1,914 m, with a park, golf course and views of the Teesta valley.', 'Year-round', 4.4, '₹20', '9:00 AM – 5:00 PM'),
        SP('s-durpin', 'Durpin Monastery', 'Spiritual', 27.06, 88.47, 'A 1976 Tibetan monastery atop Durpin Hill with 30 m wall paintings and a library of Buddhist texts.', 'Year-round', 4.5, 'Free', '8:00 AM – 5:00 PM'),
        SP('s-pedong', 'Pedong', 'Nature', 27.05, 88.55, 'A 1,240 m hamlet of cardamom forests, an ancient Damsang fort and Himalayan sunrise views.', 'Year-round', 4.4, 'Free', 'Open 24 hrs'),
      ]),
    ],
  },
  {
    id: 'uttarpradesh',
    name: 'Uttar Pradesh',
    grid: { r: 3, c: 4 },
    color: '#A26769',
    tagline: 'The heartland — the Taj Mahal, ghats and ancient cities',
    bestSeason: 'Oct – Mar',
    seasonLabel: 'Winter',
    peakSeason: 'Nov – Feb',
    highlights: ['Mughal Monuments', 'Ghats', 'Pilgrimage'],
    available: true,
    districts: [
      DI('d-agra', 'Agra', 0, 0, shadeHex('#A26769', -0.05), 'The city of the Taj — Mughal splendour in marble.', [
        SP('s-taj', 'Taj Mahal', 'Heritage', 27.175, 78.042, 'Shah Jahan’s 17th-century ivory-white marble mausoleum — the world’s most perfect monument to love.', 'Oct – Mar', 4.9, '₹1,300 (foreigners)', 'Sunrise – Sunset (closed Fridays)'),
        SP('s-agafort', 'Agra Fort', 'Heritage', 27.179, 78.021, 'A UNESCO red-sandstone fortress of emperors Akbar and Shah Jahan, where the latter gazed at the Taj in exile.', 'Year-round', 4.7, '₹650', 'Sunrise – Sunset'),
        SP('s-fateshpur', 'Fatehpur Sikri', 'Heritage', 27.09, 77.66, 'Akbar’s abandoned 16th-century Mughal capital, a ghost city of palaces, courtyards and the Buland Darwaza.', 'Oct – Mar', 4.7, '₹610', 'Sunrise – Sunset'),
      ]),
      DI('d-varanasi', 'Varanasi', 0, 1, shadeHex('#A26769', 0.12), 'The eternal city — ghats, Ganga aarti and silk weaving.', [
        SP('s-dashashwamedh', 'Dashashwamedh Ghat', 'Spiritual', 25.31, 82.98, 'Varanasi’s main ghat, where the Ganga aarti draws thousands each evening with fire, chant and bell.', 'Year-round', 4.8, 'Free', 'Aarti 7:00 PM daily'),
        SP('s-kashivishwanath', 'Kashi Vishwanath Temple', 'Spiritual', 25.31, 82.98, 'One of the 12 Jyotirlingas, dedicated to Lord Shiva as Vishweshwara — the spiritual heart of the city.', 'Year-round', 4.8, 'Free', '4:00 AM – 11:00 PM'),
        SP('s-sarnath', 'Sarnath', 'Heritage', 25.38, 83.02, 'Where Buddha gave his first sermon after enlightenment — stupas, the Ashoka pillar and a fine museum.', 'Year-round', 4.7, '₹25', '8:00 AM – 6:00 PM'),
      ]),
      DI('d-lucknow', 'Lucknow', 0, 2, shadeHex('#A26769', 0.24), 'The City of Nawabs — kebabs, chikankari and elegance.', [
        SP('s-bara', 'Bara Imambara', 'Heritage', 26.85, 80.95, 'An 18th-century shrine with the Bhul Bhulaiya — a labyrinth of 489 identical passages in its upper floors.', 'Year-round', 4.6, '₹50', '9:00 AM – 5:00 PM'),
        SP('s-rumi', 'Rumi Darwaza', 'Heritage', 26.86, 80.95, 'An 18th-century 60 ft gateway modelled on the Sublime Porte of Constantinople, built during the Awadh famine.', 'Year-round', 4.4, 'Free', 'Open 24 hrs'),
        SP('s-chota', 'Chota Imambara', 'Heritage', 26.85, 80.94, 'The Palace of Lights — a gilded shrine of mirrors, chandeliers and Belgian crystal built in 1838.', 'Year-round', 4.5, '₹50', '9:00 AM – 5:00 PM'),
      ]),
    ],
  },
  {
    id: 'madhyapradesh',
    name: 'Madhya Pradesh',
    grid: { r: 4, c: 3 },
    color: '#606C38',
    tagline: 'The Heart of India — temples, tigers and prehistoric caves',
    bestSeason: 'Oct – Mar',
    seasonLabel: 'Winter',
    peakSeason: 'Oct – Feb',
    highlights: ['Wildlife', 'Khajuraho Temples', 'Rock Art'],
    available: true,
    districts: [
      DI('d-bhopal', 'Bhopal', 0, 0, shadeHex('#606C38', -0.05), 'The City of Lakes — mosques, museums and prehistoric caves.', [
        SP('s-bhimbetka', 'Bhimbetka Rock Shelters', 'Heritage', 22.93, 77.58, 'A UNESCO site of 750+ sandstone shelters with 30,000-year-old rock paintings of hunts and dances.', 'Year-round', 4.6, '₹25', '9:00 AM – 5:00 PM'),
        SP('s-upperlake', 'Upper Lake (Bhojtal)', 'Nature', 23.25, 77.4, 'A 1,000-year-old lake built by King Bhoj, offering boat rides and birdwatching at sunset.', 'Year-round', 4.3, 'Boat ₹100', '6:00 AM – 7:00 PM'),
        SP('s-tajulmasajid', 'Taj-ul-Masajid', 'Spiritual', 23.25, 77.41, 'One of Asia’s largest mosques, with pink façades, minarets and a courtyard for 100,000 worshippers.', 'Year-round', 4.5, 'Free', '6:00 AM – 8:00 PM'),
      ]),
      DI('d-indore', 'Indore', 0, 1, shadeHex('#606C38', 0.12), 'The food capital — street food, palaces and a living city.', [
        SP('s-rajwada', 'Rajwada Palace', 'Heritage', 22.72, 75.86, 'A seven-storey Holkar palace of 1766 blending Maratha, Mughal and French styles in the old city.', 'Year-round', 4.5, '₹30', '10:00 AM – 5:00 PM'),
        SP('s-lalbagh', 'Lal Bagh Palace', 'Heritage', 22.72, 75.85, 'A 1886 European-style palace modelled on Buckingham, with a rose garden and a 12-pillared gateway.', 'Year-round', 4.4, '₹30', '10:00 AM – 5:00 PM'),
        SP('s-kanch', 'Kanch Mandir', 'Heritage', 22.72, 75.86, 'A Jain temple entirely mirrored — walls, ceilings and pillars glinting with glass mosaics.', 'Year-round', 4.4, 'Free', '10:00 AM – 1:00 PM, 4:00 – 7:00 PM'),
      ]),
      DI('d-chhatarpur', 'Chhatarpur (Khajuraho)', 0, 2, shadeHex('#606C38', 0.24), 'The land of the Kandariya Mahadev — temples of love in stone.', [
        SP('s-western', 'Western Group Temples', 'Heritage', 24.83, 79.92, 'A UNESCO complex of 85 surviving temples, crowned by the Kandariya Mahadev — the finest of the Khajuraho school.', 'Year-round', 4.8, '₹600', '8:00 AM – 6:00 PM'),
        SP('s-eastern', 'Eastern Group Temples', 'Heritage', 24.835, 79.925, 'Jain temples of Parsvanath and Ghantai with exquisite carved ceilings and a 4.5 m monolithic Shantinath idol.', 'Year-round', 4.7, '₹250', '8:00 AM – 6:00 PM'),
        SP('s-rannehfalls', 'Raneh Falls', 'Nature', 24.9, 79.8, 'A 47 m waterfall on the Ken river plunging into a canyon of volcanic rock, best in the monsoon.', 'Jul – Oct', 4.5, '₹25', '8:00 AM – 6:00 PM'),
      ]),
    ],
  },
];

/* Soon states rendered on the national map */
export const SOON_STATES: { name: string; grid: { r: number; c: number }; color: string }[] = [
  { name: 'Jammu & Kashmir', grid: { r: 0, c: 2 }, color: '#B9B3A5' },
  { name: 'Punjab', grid: { r: 2, c: 1 }, color: '#B9B3A5' },
  { name: 'Haryana', grid: { r: 2, c: 2 }, color: '#B9B3A5' },
  { name: 'Delhi', grid: { r: 2, c: 3 }, color: '#B9B3A5' },
  { name: 'Chhattisgarh', grid: { r: 4, c: 4 }, color: '#B9B3A5' },
  { name: 'Jharkhand', grid: { r: 4, c: 5 }, color: '#B9B3A5' },
  { name: 'Odisha', grid: { r: 5, c: 5 }, color: '#B9B3A5' },
  { name: 'Telangana', grid: { r: 5, c: 4 }, color: '#B9B3A5' },
  { name: 'Andhra Pradesh', grid: { r: 6, c: 4 }, color: '#B9B3A5' },
  { name: 'Assam', grid: { r: 1, c: 6 }, color: '#B9B3A5' },
];

/* ------------------------------------------------------------------ */
/* Hotels — generated deterministically per spot                       */
/* ------------------------------------------------------------------ */

const AMEN_COMMON = ['Free Wi-Fi', 'Air Conditioning', 'Room Service', 'Power Backup', 'Parking', 'Hot Water 24x7'];
const AMEN_DELUXE = ['Multi-cuisine Restaurant', 'Bar', 'Swimming Pool', 'Gym', 'Concierge', 'Laundry', 'Banquet Hall'];
const AMEN_LUXURY = ['Spa & Wellness', 'Rooftop Café', 'Butler Service', 'Minibar', 'Balcony with View', 'Airport Shuttle', 'Infinity Pool'];
const AMEN_HOME = ['Home-cooked Meals', 'Garden Seating', 'Local Guide', 'Kitchenette', 'Family Friendly', 'Bonfire Area'];

const REVIEWERS = ['Priya Sharma', 'Rahul Verma', 'Ananya Iyer', 'Vikram Singh', 'Meera Nair', 'Arjun Mehta', 'Sneha Reddy', 'Karan Joshi', 'Divya Menon', 'Rohit Kapoor', 'Tanvi Shah', 'Aditya Rao'];
const REVIEW_TEXTS = [
  'Spotless rooms and the staff went out of their way to arrange a local guide. The view from the balcony was worth the stay alone.',
  'Great value for money. Breakfast had fresh local produce and the location made exploring the area on foot a breeze.',
  'Booked last minute and they still arranged a cab from the station. Warm hospitality, would absolutely return.',
  'Beautiful property with a peaceful garden. Dinner here is a must — the regional thali is outstanding.',
  'A little off the main road which keeps it quiet. Rooms are spacious and housekeeping was spot on.',
  'Perfect for a family trip — the hosts arranged a bonfire and local folk music in the evening.',
  'Rooftop café with a stunning view. Loved the attention to detail in the decor and the prompt room service.',
  'One of the few places where the photos online actually match reality. Highly recommended.',
];

function genHotelsForSpot(spot: Spot): Hotel[] {
  const rnd = mulberry32(hashStr(spot.id));
  const short = spot.name.replace(/[^A-Za-z ]/g, '').trim().split(/\s+/).slice(0, 2).join(' ');
  const state = STATES.find((s) => s.districts.some((d) => d.spots.some((x) => x.id === spot.id)));
  const region = state ? state.name : '';

  const mk = (
    name: string,
    tier: Hotel['tier'],
    kind: Hotel['kind'],
    basePrice: number,
    amenPool: string[],
    amenCount: number
  ): Hotel => {
    const rating = tier === 'Luxury' ? 4.4 + rnd() * 0.5 : tier === 'Deluxe' ? 4.0 + rnd() * 0.6 : 3.6 + rnd() * 0.7;
    const reviews = Math.round(40 + rnd() * 860);
    const amenities = [...AMEN_COMMON];
    const shuffled = [...amenPool].sort(() => rnd() - 0.5);
    amenities.push(...shuffled.slice(0, amenCount));
    const roomNames: Record<Hotel['tier'], [string, string, string]> = {
      Luxury: ['Heritage Suite', 'Deluxe Room', 'Presidential Villa'],
      Deluxe: ['Executive Room', 'Family Room', 'Deluxe Suite'],
      Budget: ['Standard Room', 'Twin Room', 'Dorm Bed'],
    };
    const rn = roomNames[tier];
    const rooms = [
      { name: rn[0], price: Math.round(basePrice), sleeps: 2, perks: ['Breakfast included', 'Free cancellation', 'Daily housekeeping'] },
      { name: rn[1], price: Math.round(basePrice * 1.45), sleeps: 3, perks: ['Breakfast included', 'Extra bed available', 'Balcony'] },
      { name: rn[2], price: Math.round(basePrice * 2.3), sleeps: 4, perks: ['All meals included', 'Private terrace', 'Butler service'] },
    ];
    const hotelId = `h-${spot.id}-${tier.toLowerCase()}-${kind.toLowerCase()}`;
    const reviewCount = 2 + Math.floor(rnd() * 2);
    const reviewsList: Review[] = [];
    for (let i = 0; i < reviewCount; i++) {
      const r = mulberry32(hashStr(hotelId + i));
      reviewsList.push({
        name: REVIEWERS[Math.floor(r() * REVIEWERS.length)],
        rating: Math.round((3.6 + r() * 1.3) * 10) / 10,
        date: `${['Jan', 'Mar', 'Jun', 'Sep', 'Nov', 'Dec'][Math.floor(r() * 6)]} ${2024 + Math.floor(r() * 3)}`,
        text: REVIEW_TEXTS[Math.floor(r() * REVIEW_TEXTS.length)],
      });
    }
    return {
      id: hotelId,
      spotId: spot.id,
      name,
      tier,
      kind,
      rating: Math.round(rating * 10) / 10,
      reviews,
      price: basePrice,
      amenities,
      blurb: `${kind === 'Homestay' ? 'A warm family-run stay' : `A${tier === 'Luxury' ? 'n elegant' : ' well-appointed'} ${kind.toLowerCase()}`} in ${short}, ${region} — ${tier === 'Budget' ? 'clean, comfortable and great value' : 'pampering every sense'}.`,
      rooms,
      color: shadeHex(spot.type === 'Beach' ? '#2E86AB' : spot.type === 'Hill' ? '#6A8EAE' : spot.type === 'Spiritual' || spot.type === 'Heritage' ? '#C4552D' : '#2D6A4F', (rnd() - 0.5) * 0.2),
      reviewsList,
    } as Hotel;
  };

  const hotels: Hotel[] = [
    mk(`The Grand ${short}`, 'Luxury', 'Hotel', 9500 + Math.round(rnd() * 6000), AMEN_LUXURY, 5),
    mk(`${short} Heritage Suites`, 'Deluxe', 'Hotel', 3200 + Math.round(rnd() * 2200), AMEN_DELUXE, 4),
    mk(`Hotel ${short} Inn`, 'Budget', 'Hotel', 900 + Math.round(rnd() * 1100), [], 0),
    mk(`${short} Homestay`, 'Budget', 'Homestay', 1100 + Math.round(rnd() * 1300), AMEN_HOME, 3),
  ];
  return hotels;
}

/* Attach hotels to every spot */
for (const st of STATES) {
  for (const d of st.districts) {
    for (const s of d.spots) {
      s.hotels = genHotelsForSpot(s);
    }
  }
}

export function findSpot(spotId: string): { spot: Spot; district: District; state: IndianState } | null {
  for (const st of STATES) {
    for (const d of st.districts) {
      const spot = d.spots.find((s) => s.id === spotId);
      if (spot) return { spot, district: d, state: st };
    }
  }
  return null;
}

export function findHotel(hotelId: string): { hotel: Hotel; spot: Spot; district: District; state: IndianState } | null {
  for (const st of STATES) {
    for (const d of st.districts) {
      for (const s of d.spots) {
        const h = s.hotels.find((x) => x.id === hotelId);
        if (h) return { hotel: h, spot: s, district: d, state: st };
      }
    }
  }
  return null;
}

export function hotelsInState(stateId: string): { hotel: Hotel; spot: Spot; district: District; state: IndianState }[] {
  const out: { hotel: Hotel; spot: Spot; district: District; state: IndianState }[] = [];
  for (const st of STATES) {
    if (st.id !== stateId) continue;
    for (const d of st.districts) {
      for (const s of d.spots) {
        for (const h of s.hotels) out.push({ hotel: h, spot: s, district: d, state: st });
      }
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Agents & packages                                                   */
/* ------------------------------------------------------------------ */

export const AGENTS: Agent[] = [
  { id: 'ag-rajesh', name: 'Rajesh Sharma', agency: 'Rajasthan Trails', homeState: 'Rajasthan', rating: 4.8, trips: 1240, responseTime: '~1 hr', verified: true, about: 'Third-generation Rajasthani guide specialising in heritage circuits, desert camps and palace stays.', phone: '+91 98290 12345', color: '#C4552D' },
  { id: 'ag-ananya', name: 'Ananya Nair', agency: 'Kerala Spice Tours', homeState: 'Kerala', rating: 4.9, trips: 980, responseTime: '~2 hrs', verified: true, about: 'Ayurveda and backwater specialist crafting slow, immersive journeys through God’s Own Country.', phone: '+91 98470 23456', color: '#1E7A5A' },
  { id: 'ag-vikram', name: 'Vikram Rao', agency: 'Goa Horizons', homeState: 'Goa', rating: 4.7, trips: 760, responseTime: '~1 hr', verified: true, about: 'Beach-hopping, spice plantation and Old Goa heritage tours with handpicked stays.', phone: '+91 98220 34567', color: '#2E86AB' },
  { id: 'ag-priya', name: 'Priya Thakur', agency: 'Himalayan Wraps', homeState: 'Uttarakhand', rating: 4.8, trips: 1120, responseTime: '~3 hrs', verified: true, about: 'Char Dham pilgrimages, valley treks and riverside camps across the Garhwal and Kumaon Himalayas.', phone: '+91 98100 45678', color: '#6A8EAE' },
  { id: 'ag-arjun', name: 'Arjun Pillai', agency: 'South Odyssey', homeState: 'Tamil Nadu', rating: 4.6, trips: 890, responseTime: '~2 hrs', verified: true, about: 'Temple trails, hill stations and coffee estates across Tamil Nadu, Karnataka and Kerala.', phone: '+91 98400 56789', color: '#D4A017' },
  { id: 'ag-sneha', name: 'Sneha Desai', agency: 'Maharashtra Trails', homeState: 'Maharashtra', rating: 4.7, trips: 640, responseTime: '~1 hr', verified: true, about: 'Fort treks, wine tours and Mumbai street-food walks led by local experts.', phone: '+91 98900 67890', color: '#9C6644' },
  { id: 'ag-rahul', name: 'Rahul Iyer', agency: 'Gujarat Heritage', homeState: 'Gujarat', rating: 4.8, trips: 720, responseTime: '~2 hrs', verified: true, about: 'Stepwells, Gir lions and Rann of Kutch full-moon safaris with community-led experiences.', phone: '+91 98790 78901', color: '#E07A5F' },
  { id: 'ag-debasish', name: 'Debasish Roy', agency: 'Bengal Discoveries', homeState: 'West Bengal', rating: 4.6, trips: 540, responseTime: '~3 hrs', verified: true, about: 'Kolkata heritage walks, Darjeeling toy-train journeys and Sundarbans boat safaris.', phone: '+91 98300 89012', color: '#3D5A80' },
  { id: 'ag-meena', name: 'Meena Krishnan', agency: 'Wild India Journeys', homeState: 'Madhya Pradesh', rating: 4.7, trips: 410, responseTime: '~2 hrs', verified: true, about: 'Tiger safaris, Khajuraho temple trails and rock-art expeditions in the heart of India.', phone: '+91 98260 90123', color: '#606C38' },
];

export function findAgent(id: string): Agent {
  return AGENTS.find((a) => a.id === id) ?? AGENTS[0];
}

const D = (d: number, title: string, desc: string): PackageDay => ({ d, title, desc });

export const PACKAGES: TourPackage[] = [
  {
    id: 'pk-rajasthan',
    agentId: 'ag-rajesh',
    title: 'Royal Rajasthan Odyssey',
    stateNames: ['Rajasthan'],
    days: 8,
    nights: 7,
    price: 24999,
    rating: 4.8,
    reviews: 312,
    groupSize: '2 – 12 travellers',
    includes: ['7 nights heritage stays', 'All breakfasts & 4 dinners', 'Private Innova with driver', 'Desert camp night', 'Guide at all monuments'],
    tags: ['Heritage', 'Family', 'Luxury'],
    itinerary: [
      D(1, 'Arrive Jaipur', 'Pickup from Jaipur airport, check into a restored haveli, evening walk through the old bazaars.'),
      D(2, 'Jaipur Heritage', 'Amber Fort by elephant jeep, Hawa Mahal, City Palace and a block-printing workshop.'),
      D(3, 'Pushkar & Ajmer', 'Day trip to the sacred lake of Pushkar and the Ajmer Sharif dargah.'),
      D(4, 'Jaipur to Udaipur', 'Scenic drive via the Aravalli hills; boat ride on Lake Pichola at sunset.'),
      D(5, 'Udaipur', 'City Palace, Jag Mandir island and a Rajasthani folk dance evening.'),
      D(6, 'Udaipur to Jodhpur', 'Drive to the Blue City; Mehrangarh Fort at golden hour.'),
      D(7, 'Jodhpur to Jaisalmer', 'Desert safari on camels, night under the stars at a luxury desert camp.'),
      D(8, 'Jaisalmer Departure', 'Sonar Quila at dawn, breakfast and drop at airport or railway station.'),
    ],
    gradient: ['#C4552D', '#8C3B1E'],
  },
  {
    id: 'pk-kerala',
    agentId: 'ag-ananya',
    title: 'Kerala Backwaters & Spice Hills',
    stateNames: ['Kerala'],
    days: 7,
    nights: 6,
    price: 18499,
    rating: 4.9,
    reviews: 428,
    groupSize: '2 – 10 travellers',
    includes: ['6 nights curated stays', 'Houseboat cruise with meals', 'Spice plantation tour', 'Ayurvedic massage', 'All breakfasts'],
    tags: ['Beach', 'Nature', 'Wellness'],
    itinerary: [
      D(1, 'Arrive Kochi', 'Chinese fishing nets at Fort Kochi, a stroll through Jew Town and a Kathakali show.'),
      D(2, 'Munnar', 'Drive to the tea hills; visit a spice plantation and the Eravikulam wildlife sanctuary.'),
      D(3, 'Munnar', 'Mattupetty dam, Top Station sunrise and a tea-tasting at a colonial estate.'),
      D(4, 'Thekkady', 'Boat safari on Periyar lake, spice market and a bamboo rafting evening.'),
      D(5, 'Alleppey Houseboat', 'Board a traditional kettuvallam; cruise the backwaters with a chef on board.'),
      D(6, 'Kovalam', 'Relax on the crescent beach; Ayurvedic massage and a seafood dinner by the sea.'),
      D(7, 'Departure', 'Sunrise at Kovalam, drop at Trivandrum airport or railway station.'),
    ],
    gradient: ['#1E7A5A', '#0F4A36'],
  },
  {
    id: 'pk-goa',
    agentId: 'ag-vikram',
    title: 'Goa Sun, Sand & Heritage',
    stateNames: ['Goa'],
    days: 5,
    nights: 4,
    price: 12999,
    rating: 4.7,
    reviews: 265,
    groupSize: '2 – 16 travellers',
    includes: ['4 nights beachfront stay', 'Water sports session', 'Old Goa heritage walk', 'Spice plantation visit', 'All breakfasts'],
    tags: ['Beach', 'Nightlife', 'Heritage'],
    itinerary: [
      D(1, 'Arrive North Goa', 'Check into a Baga beach stay; evening at the beach shacks and a sunset cruise.'),
      D(2, 'North Goa', 'Fort Aguada, Anjuna flea market and water sports at Baga creek.'),
      D(3, 'Old Goa & Spice Farm', 'Basilica of Bom Jesus, Se Cathedral and a spice plantation lunch.'),
      D(4, 'South Goa', 'Palolem beach day — kayaking, dolphin spotting and a beachside Goan dinner.'),
      D(5, 'Departure', 'Leisurely breakfast and drop at Dabolim airport or Madgaon station.'),
    ],
    gradient: ['#2E86AB', '#1A5A7A'],
  },
  {
    id: 'pk-himalaya',
    agentId: 'ag-priya',
    title: 'Himalayan Retreat: Manali & Spiti',
    stateNames: ['Himachal Pradesh', 'Uttarakhand'],
    days: 9,
    nights: 8,
    price: 27999,
    rating: 4.8,
    reviews: 189,
    groupSize: '2 – 8 travellers',
    includes: ['8 nights stays & camps', 'All meals in camps', 'Private Tempo Traveller', 'Paragliding & river rafting', 'Permits & tolls'],
    tags: ['Adventure', 'Hills', 'Trekking'],
    itinerary: [
      D(1, 'Arrive Manali', 'Drive from Delhi via Chandigarh; evening at the Mall Road in Old Manali.'),
      D(2, 'Manali', 'Hadimba temple, Vashisht hot springs and a Tibetan market stroll.'),
      D(3, 'Solang Valley', 'Paragliding, zorbing and cable-car rides in the meadow valley.'),
      D(4, 'Rohtang & Sissu', 'Cross Rohtang Pass to the Lahaul valley; visit Sissu waterfall and Keylong.'),
      D(5, 'Chandratal Lake', 'Drive to the Moon Lake at 4,300 m; camp by the water under the stars.'),
      D(6, 'Spiti Valley', 'Dhankar monastery, the Pin valley and Kibber village at 4,270 m.'),
      D(7, 'Key Monastery', 'Visit the 11th-century Key Gompa and the world’s highest village, Langza.'),
      D(8, 'Return via Narkanda', 'Scenic descent with a halt at Hatu peak; overnight in Shimla.'),
      D(9, 'Departure', 'Drop at Chandigarh airport or Kalka railway station.'),
    ],
    gradient: ['#7D5BA6', '#4A3573'],
  },
  {
    id: 'pk-south',
    agentId: 'ag-arjun',
    title: 'South India Heritage Trail',
    stateNames: ['Tamil Nadu', 'Karnataka'],
    days: 10,
    nights: 9,
    price: 31999,
    rating: 4.7,
    reviews: 143,
    groupSize: '2 – 10 travellers',
    includes: ['9 nights curated stays', 'All breakfasts', 'Private Innova with driver', 'Guide at temples & Hampi', 'Ooty toy train ride'],
    tags: ['Heritage', 'Temples', 'Hills'],
    itinerary: [
      D(1, 'Arrive Chennai', 'Marina beach sunset, Fort St George and a filter-coffee evening in Mylapore.'),
      D(2, 'Chennai to Mahabalipuram', 'Shore temple and the Arjuna’s Penance rock reliefs en route.'),
      D(3, 'Pondicherry', 'Auroville, the French quarter and a seaside cycle ride.'),
      D(4, 'To Madurai', 'Meenakshi temple evening aarti and a traditional Chettinad dinner.'),
      D(5, 'Madurai to Ooty', 'Toy train ride through the Nilgiri hills; boating on Ooty lake.'),
      D(6, 'Ooty & Coonoor', 'Tea estate tour, Doddabetta peak and a Coonoor heritage walk.'),
      D(7, 'To Mysore', 'Brindavan gardens by night; Mysore palace illumination.'),
      D(8, 'Mysore', 'Chamundi hill sunrise, silk saree weaving and a Devaraja market food walk.'),
      D(9, 'To Hampi', 'Vittala temple complex at sunset; coracle ride on the Tungabhadra.'),
      D(10, 'Hampi Departure', 'Virupaksha temple morning puja, drop at Hospet station or Hubli airport.'),
    ],
    gradient: ['#D4A017', '#8A6A12'],
  },
  {
    id: 'pk-maharashtra',
    agentId: 'ag-sneha',
    title: 'Maharashtra Forts & Mumbai Pulse',
    stateNames: ['Maharashtra'],
    days: 6,
    nights: 5,
    price: 15999,
    rating: 4.6,
    reviews: 178,
    groupSize: '2 – 14 travellers',
    includes: ['5 nights stays', 'All breakfasts', 'SUV with driver', 'Fort trek with guide', 'Mumbai street-food walk'],
    tags: ['City', 'Adventure', 'Heritage'],
    itinerary: [
      D(1, 'Arrive Mumbai', 'Gateway of India, Elephanta caves ferry and a Marine Drive sunset.'),
      D(2, 'Mumbai', 'Dhobi Ghat, Dharavi community walk and a Chowpatty street-food evening.'),
      D(3, 'Mumbai to Pune', 'Shaniwar Wada, Aga Khan Palace and an Osho teerth park visit.'),
      D(4, 'Sinhagad Fort', 'Trek to the fort of the lion; Panshet lake picnic and local Pithla Bhakri lunch.'),
      D(5, 'Pune to Nashik', 'Sula vineyards tasting, Pandavleni caves and a Godavari ghat evening.'),
      D(6, 'Departure', 'Drop at Nashik airport or Pune railway station.'),
    ],
    gradient: ['#9C6644', '#6B4226'],
  },
  {
    id: 'pk-gujarat',
    agentId: 'ag-rahul',
    title: 'Gujarat Cultural Circuit',
    stateNames: ['Gujarat'],
    days: 7,
    nights: 6,
    price: 19999,
    rating: 4.8,
    reviews: 156,
    groupSize: '2 – 12 travellers',
    includes: ['6 nights stays', 'All breakfasts & 3 dinners', 'Scorpio with driver', 'Gir lion safari', 'Rann Utsav entry'],
    tags: ['Wildlife', 'Heritage', 'Culture'],
    itinerary: [
      D(1, 'Arrive Ahmedabad', 'Sabarmati Ashram, Adalaj stepwell and a heritage walk through the pols.'),
      D(2, 'Ahmedabad to Vadodara', 'Laxmi Vilas Palace, Sayaji Baug and a Champaner sunset.'),
      D(3, 'Vadodara to Sasan Gir', 'Drive to the lion country; evening at the Gir Interpretation Zone.'),
      D(4, 'Gir Safari', 'Dawn Asiatic lion safari; visit the Devalia safari park and a Maldhari village.'),
      D(5, 'To Dwarka', 'Dwarkadhish temple evening aarti and a Gomti ghat walk.'),
      D(6, 'Bet Dwarka', 'Island ferry, beaches and the Nageshwar Jyotirlinga.'),
      D(7, 'Departure', 'Drop at Jamnagar or Ahmedabad airport.'),
    ],
    gradient: ['#E07A5F', '#9C4A2E'],
  },
  {
    id: 'pk-bengal',
    agentId: 'ag-debasish',
    title: 'Bengal & Darjeeling Tea Trail',
    stateNames: ['West Bengal'],
    days: 8,
    nights: 7,
    price: 22499,
    rating: 4.7,
    reviews: 132,
    groupSize: '2 – 10 travellers',
    includes: ['7 nights stays', 'All breakfasts', 'Toy train joy ride', 'Tea estate tour', 'Sundarbans boat safari'],
    tags: ['Hills', 'Heritage', 'Wildlife'],
    itinerary: [
      D(1, 'Arrive Kolkata', 'Victoria Memorial, Howrah bridge at dusk and an adda over coffee.'),
      D(2, 'Kolkata Heritage', 'Dakshineswar temple, Kumartuli potters’ colony and a Bengali cuisine trail.'),
      D(3, 'To Darjeeling', 'Joy batasia loop; Ghoom monastery and a tea-tasting at Happy Valley.'),
      D(4, 'Tiger Hill', 'Pre-dawn drive for the Kanchenjunga sunrise; tea estate walk in the afternoon.'),
      D(5, 'Darjeeling to Kalimpong', 'Deolo hill, Durpin monastery and a nursery garden stroll.'),
      D(6, 'To Kolkata', 'Return by train; evening at the Park Street jazz cafes.'),
      D(7, 'Sundarbans', 'Drive to Godkhali, boat safari through the mangrove creeks; spotted deer and crocodiles.'),
      D(8, 'Departure', 'Return to Kolkata and drop at airport or Howrah station.'),
    ],
    gradient: ['#3D5A80', '#243A5C'],
  },
  {
    id: 'pk-golden',
    agentId: 'ag-rajesh',
    title: 'Golden Triangle Classic',
    stateNames: ['Delhi', 'Rajasthan', 'Uttar Pradesh'],
    days: 6,
    nights: 5,
    price: 14999,
    rating: 4.6,
    reviews: 287,
    groupSize: '2 – 16 travellers',
    includes: ['5 nights stays', 'All breakfasts', 'Private Innova', 'Taj Mahal sunrise visit', 'City guides included'],
    tags: ['Heritage', 'First-timers', 'Budget'],
    itinerary: [
      D(1, 'Arrive Delhi', 'India Gate, Qutub Minar and a Chandni Chowk food walk.'),
      D(2, 'Delhi to Agra', 'Sikandra en route; Mehtab Bagh sunset across the Yamuna.'),
      D(3, 'Agra', 'Taj Mahal at sunrise, Agra Fort and the marble inlay workshops.'),
      D(4, 'Agra to Jaipur', 'Fatehpur Sikri en route; evening at the Jaipur bazaars.'),
      D(5, 'Jaipur', 'Amber Fort, Hawa Mahal and a block-printing demonstration.'),
      D(6, 'Departure', 'Drop at Jaipur airport or railway station.'),
    ],
    gradient: ['#A26769', '#6E3F41'],
  },
  {
    id: 'pk-wildmp',
    agentId: 'ag-meena',
    title: 'Wild Madhya Pradesh',
    stateNames: ['Madhya Pradesh'],
    days: 6,
    nights: 5,
    price: 16999,
    rating: 4.7,
    reviews: 98,
    groupSize: '2 – 8 travellers',
    includes: ['5 nights jungle lodges', 'All meals', 'Gypsy safari permits', 'Khajuraho temple guide', 'Naturalist on call'],
    tags: ['Wildlife', 'Adventure', 'Temples'],
    itinerary: [
      D(1, 'Arrive Bhopal', 'Bhimbetka rock shelters and an Upper lake boat ride.'),
      D(2, 'To Bandhavgarh', 'Drive to the tiger reserve; evening nature walk.'),
      D(3, 'Bandhavgarh Safari', 'Dawn gypsy safari; fort ruins and a naturalist talk by the campfire.'),
      D(4, 'To Kanha', 'Drive through the sal forests; afternoon safari in Kanha meadows.'),
      D(5, 'Kanha to Khajuraho', 'Western group temples at sunset; the Sounding Stones dance show.'),
      D(6, 'Departure', 'Khajuraho eastern group temples at dawn; drop at airport.'),
    ],
    gradient: ['#606C38', '#3D4622'],
  },
];

/* ------------------------------------------------------------------ */
/* Fleet, meals, cities                                                */
/* ------------------------------------------------------------------ */

export const VEHICLES: Vehicle[] = [
  { id: 'v-innova', name: 'Toyota Innova', category: 'SUV / MUV', seats: 7, pricePerDay: 4500, features: ['AC', 'Push-button start', 'Spacious boot', '3-point belts for all'], icon: 'car' },
  { id: 'v-xylo', name: 'Mahindra Xylo', category: 'SUV / MUV', seats: 7, pricePerDay: 3200, features: ['AC', 'High ground clearance', 'Economy mileage', 'Luggage carrier'], icon: 'car' },
  { id: 'v-scorpio', name: 'Mahindra Scorpio', category: 'SUV / MUV', seats: 7, pricePerDay: 3800, features: ['AC', 'Powerful diesel engine', 'Fold-flat seats', 'Roof rails'], icon: 'car' },
  { id: 'v-bolero', name: 'Mahindra Bolero', category: 'SUV / MUV', seats: 7, pricePerDay: 3000, features: ['AC', 'Rugged build', 'Hill-hold assist', 'Best for rural roads'], icon: 'car' },
  { id: 'v-winger', name: 'Tata Winger', category: 'Group & Luxury', seats: 13, pricePerDay: 5500, features: ['AC', 'Push-back seats', 'Large boot', 'Ideal for pilgrim groups'], icon: 'bus' },
  { id: 'v-tempo', name: 'Tempo Traveller', category: 'Group & Luxury', seats: 20, pricePerDay: 8000, features: ['AC', 'Reclining seats', 'Music system', 'Group luggage bay'], icon: 'bus' },
  { id: 'v-sedan', name: 'Luxury Sedan (E-Class)', category: 'Group & Luxury', seats: 4, pricePerDay: 9000, features: ['Chauffeur driven', 'Minibar', 'Leather seats', 'Airport pickup'], icon: 'car-sport' },
  { id: 'v-suv', name: 'Luxury SUV (Range Rover)', category: 'Group & Luxury', seats: 6, pricePerDay: 14000, features: ['Chauffeur driven', 'Panoramic roof', 'Massaging seats', 'Butler service'], icon: 'car-sport' },
];

export const MEAL_SLOTS: MealSlot[] = [
  { id: 'breakfast', label: 'Breakfast', icon: 'sunny-outline', price: 250 },
  { id: 'lunch', label: 'Lunch', icon: 'restaurant-outline', price: 450 },
  { id: 'snacks', label: 'Evening Snacks', icon: 'cafe-outline', price: 150 },
  { id: 'dinner', label: 'Dinner', icon: 'moon-outline', price: 500 },
];

export const ORIGIN_CITIES = [
  'Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad',
  'Ahmedabad', 'Pune', 'Jaipur', 'Chandigarh', 'Kochi', 'Nagpur',
];

export const TRANSIT_MODES = [
  { id: 'flight', label: 'Flight', icon: 'airplane' },
  { id: 'train', label: 'Rail (Train)', icon: 'train' },
  { id: 'selfdrive', label: 'Self-Drive', icon: 'car' },
];

export const SPOT_TYPE_COLORS: Record<SpotType, string> = {
  Heritage: '#C4552D',
  Nature: '#2D6A4F',
  Beach: '#2E86AB',
  Hill: '#6A8EAE',
  Wildlife: '#606C38',
  Spiritual: '#7D5BA6',
  City: '#9C6644',
  Adventure: '#E07A5F',
};

export const SPOT_TYPE_ICONS: Record<SpotType, string> = {
  Heritage: 'business',
  Nature: 'leaf',
  Beach: 'umbrella',
  Hill: 'triangle',
  Wildlife: 'paw',
  Spiritual: 'flame',
  City: 'business',
  Adventure: 'bicycle',
};
