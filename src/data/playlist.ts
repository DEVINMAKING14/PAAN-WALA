import { Track } from '../types';

export const DEFAULT_PLAYLIST: Track[] = [
  {
    id: 'eM8Mjuq4MwQ',
    title: 'Aankhein Khuli Song | Mohabbatein',
    artist: 'Lata Mangeshkar, Udit Narayan • YRF',
    youtubeId: 'eM8Mjuq4MwQ',
    duration: '6:06',
  },
  {
    id: 'zWPsjhBaRb0',
    title: 'Humko Humise Chura Lo | Mohabbatein',
    artist: 'Lata Mangeshkar, Udit Narayan • YRF',
    youtubeId: 'zWPsjhBaRb0',
    duration: '7:52',
  },
  {
    id: 'kzTWRX9Dhrg',
    title: 'Chalte Chalte | Mohabbatein',
    artist: 'Udbhav, Manohar Shetty, Ishaan • YRF',
    youtubeId: 'kzTWRX9Dhrg',
    duration: '7:38',
  },
  {
    id: 'OpLD97fG9Hw',
    title: 'Soni Soni (Holi Song) | Mohabbatein',
    artist: 'Udit Narayan, Jaspinder Narula • YRF',
    youtubeId: 'OpLD97fG9Hw',
    duration: '9:07',
  },
  {
    id: 'bC7RmYYMqTw',
    title: 'Pairon Mein Bandhan Hai | Mohabbatein',
    artist: 'Udbhav, Manohar Shetty, Sonali • YRF',
    youtubeId: 'bC7RmYYMqTw',
    duration: '7:01',
  },
  {
    id: '1cWR8QVhJLE',
    title: 'Zinda Rehti Hain Mohabbatein',
    artist: 'Lata Mangeshkar, Udit Narayan • YRF',
    youtubeId: '1cWR8QVhJLE',
    duration: '2:25',
  },
  {
    id: '5KkkDRCj3l8',
    title: 'Hansta Hua Noorani Chehra | Parasmani',
    artist: 'Lata Mangeshkar, Kamal Barot • Rajshri',
    youtubeId: '5KkkDRCj3l8',
    duration: '4:02',
  },
  {
    id: 'vejr2_PXVQo',
    title: 'Gori Tera Gaon Bada Pyara | Chitchor',
    artist: 'K. J. Yesudas • Rajshri',
    youtubeId: 'vejr2_PXVQo',
    duration: '5:08',
  },
  {
    id: '4qwFpKmYH4k',
    title: 'Aane Se Uske Aaye Bahar | Jeene Ki Raah',
    artist: 'Mohammed Rafi • Rajshri',
    youtubeId: '4qwFpKmYH4k',
    duration: '4:15',
  },
  {
    id: 'aSqwfhYAoxs',
    title: 'Sawan Ka Mahina | Milan',
    artist: 'Mukesh, Lata Mangeshkar • Rajshri',
    youtubeId: 'aSqwfhYAoxs',
    duration: '5:27',
  },
];


export const PAAN_FLAVORS = [
  {
    id: 'banarasi-meetha',
    name: 'Banarasi Meetha Paan',
    hindiName: 'शाही बनारसी मीठा पान',
    description: 'Fresh Maghai patta layered with fragrant Gulkand, silver foil, green cardamom, glazed cherries, and sweet saunf.',
    price: '₹30',
    specialty: '100% Tobacco Free • Melt-in-mouth sweetness',
    ingredients: ['Gulkand (Rose Petal Jam)', 'Chandi ka Vark (Silver Foil)', 'Elaichi (Green Cardamom)', 'Tutti Frutti & Cherries', 'Kashmiri Meetha Masala'],
    color: 'from-rose-500/20 to-amber-500/20',
  },
  {
    id: 'fire-paan',
    name: 'Live Fire Paan 🔥',
    hindiName: 'धमाकेदार फायर पान',
    description: 'Flaming clove & spiced gulkand ignited on the betel leaf, eaten in one thrilling fiery mouthful!',
    price: '₹50',
    specialty: 'Signature Street Spectacle • Warm sweet burst',
    ingredients: ['Flaming Laung (Clove)', 'Kasturi Masala', 'Rose Syrup', 'Camphor Essence', 'Crushed Nuts'],
    color: 'from-orange-600/30 to-red-600/30',
    isFire: true,
  },
  {
    id: 'calcutta-saada',
    name: 'Calcutta Saada Special',
    hindiName: 'कलकत्ता सादा पान',
    description: 'Crisp Calcutta patta, slow-cured kattha, delicate chuna touch, roasted dry betel nut, and aromatic mace.',
    price: '₹25',
    specialty: 'Classic Connoisseur Choice • Herbal & Crisp',
    ingredients: ['Calcutta Leaf', 'Khadir Kattha', 'Shikari Supari', 'Nutmeg & Javitri', 'Desi Elaichi'],
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 'chocolate-maghai',
    name: 'Belgian Chocolate Paan',
    hindiName: 'चॉकलेट मगही डिलाइट',
    description: 'Crisp Maghai betel leaf coated in rich Belgian dark chocolate glaze, crunchy almond flakes, and coconut shred.',
    price: '₹60',
    specialty: 'Modern Street Fusion • Chilled crunch',
    ingredients: ['Dark Chocolate Fondant', 'Roasted Almond Shavings', 'Dry Coconut Flakes', 'Sweet Gulkand', 'Silver Dust'],
    color: 'from-amber-700/30 to-stone-800/40',
  },
  {
    id: 'rajwadi-shahi',
    name: 'Rajwadi Gold Shahi Paan',
    hindiName: 'रजवाड़ी 24K गोल्ड पान',
    description: 'Fit for royalty. Infused with pure saffron (Kesar), 24K edible gold leaf, musk melon seeds, and royal attar.',
    price: '₹101',
    specialty: 'Pure Luxury • Shahi Nazrana',
    ingredients: ['24K Gold Leaf', 'Kashmiri Kesar (Saffron)', 'Chironji & Pistachio', 'Rooh Kewra Attar', 'Sweet Maghai Patta'],
    color: 'from-yellow-500/30 to-amber-600/30',
  },
];

export const STREET_BANTER = [
  {
    hindi: 'अरे भइया! कत्था तेज़ रखें या गुलकंद ज़्यादा?',
    english: '"Bhaiya! Keep the kattha sharp, or extra gulkand for you today?"',
    author: 'Ramesh Chaurasia (40 yrs at the dukaan)',
  },
  {
    hindi: 'ज़िंदगी भी मीठे पान जैसी होनी चाहिए—थोड़ा चूना कम, मिठास भरपूर!',
    english: '"Life should be like a sweet paan—less friction, abundant sweetness!"',
    author: 'Ghat Philosopher, Assi Ghat Varanasi',
  },
  {
    hindi: 'पान के पत्ते पे दिल रख दिया है, चबा के देखिए कितना सुकून मिलेगा।',
    english: '"Folded our heart onto the betel leaf; taste the crisp serenity."',
    author: 'Banaras Street Lore',
  },
  {
    hindi: 'गाना सुनोगे या सीधे बनारसी पान का जायका लोगे?',
    english: '"Fancy tuning into retro radio tunes or diving into that royal paan?"',
    author: 'The Transistor Radio',
  },
];
