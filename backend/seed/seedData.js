const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Business = require('../models/Business');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const Itinerary = require('../models/Itinerary');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_local_tourism';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('[Seed] Database connected successfully.');

    // Clear existing collections
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Business.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Favorite.deleteMany({});
    await Itinerary.deleteMany({});
    console.log('[Seed] Cleared existing records.');

    // 1. Create Users
    const users = await User.create([
      {
        name: 'Aarav Sharma',
        email: 'tourist@example.com',
        password: 'Password@123',
        role: 'tourist',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        interests: ['trekking', 'culinary', 'heritage']
      },
      {
        name: 'Priya Patel',
        email: 'owner@example.com',
        password: 'Password@123',
        role: 'business_owner',
        phone: '+91 91234 56789',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        interests: ['heritage', 'handicrafts']
      },
      {
        name: 'Sanjay Admin',
        email: 'admin@example.com',
        password: 'Password@123',
        role: 'admin',
        phone: '+91 99999 88888',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        interests: ['wildlife', 'trekking', 'wellness']
      }
    ]);
    console.log(`[Seed] Created ${users.length} users (Tourist, Business Owner, Admin).`);

    const touristUser = users[0];
    const ownerUser = users[1];

    // 2. Create Destinations
    const destinations = await Destination.create([
      {
        name: 'Munnar Tea Highlands',
        state: 'Kerala',
        region: 'Western Ghats',
        description: 'Munnar is a picturesque hill station situated in the Western Ghats mountain range in Kerala. Famous for rolling green tea plantations, misty valleys, crisp mountain air, and exotic wildlife at Eravikulam National Park.',
        shortDescription: 'Lush green tea plantations, misty hills, and scenic mountain treks.',
        category: 'hill_station',
        images: [
          'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80'
        ],
        location: { lat: 10.0889, lng: 77.0595 },
        bestTimeToVisit: 'September to March',
        highlights: ['Tea Estate Treks', 'Mattupetty Dam', 'Eravikulam National Park', 'Attukad Waterfalls'],
        featured: true
      },
      {
        name: 'Jaipur Royal Heritage',
        state: 'Rajasthan',
        region: 'Northern India',
        description: 'Known as the Pink City, Jaipur is renowned for its majestic forts, grand palaces, vibrant textile bazaars, and traditional handcrafted blue pottery reflecting centuries of regal craftsmanship.',
        shortDescription: 'Regal palaces, grand forts, colorful bazaars, and timeless artisan crafts.',
        category: 'heritage',
        images: [
          'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?auto=format&fit=crop&w=1200&q=80'
        ],
        location: { lat: 26.9124, lng: 75.7873 },
        bestTimeToVisit: 'October to March',
        highlights: ['Amber Palace', 'Hawa Mahal', 'Johari Bazaar', 'City Palace'],
        featured: true
      },
      {
        name: 'Gokarna Coastal Sanctuary',
        state: 'Karnataka',
        region: 'Konkan Coast',
        description: 'A serene coastal town known for sacred temples and pristine beaches where the Western Ghats meet the Arabian Sea. Popular for peaceful cliff treks, sunsets, and local Konkani seafood.',
        shortDescription: 'Golden sand beaches, cliff trails, and peaceful coastal retreats.',
        category: 'beach',
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'
        ],
        location: { lat: 14.5479, lng: 74.3188 },
        bestTimeToVisit: 'November to February',
        highlights: ['Om Beach Trek', 'Kudle Beach Sunset', 'Mahabaleshwar Temple', 'Half Moon Beach'],
        featured: true
      },
      {
        name: 'Bandipur Wilderness Reserve',
        state: 'Karnataka',
        region: 'Nilgiri Biosphere',
        description: 'A premier tiger reserve and lush national park nestled in the foothills of the Nilgiris, home to elephants, leopards, gaur, and over 200 species of colorful birds.',
        shortDescription: 'Protected jungle safaris, majestic wildlife, and rich Nilgiri biodiversity.',
        category: 'wildlife',
        images: [
          'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
        ],
        location: { lat: 11.6664, lng: 76.6291 },
        bestTimeToVisit: 'October to May',
        highlights: ['Open Jeep Jungle Safari', 'Bird Watching Trails', 'Moyar River Gorge', 'Eco Conservation Camps'],
        featured: true
      }
    ]);
    console.log(`[Seed] Created ${destinations.length} destinations.`);

    // 3. Create Businesses
    const businesses = await Business.create([
      {
        owner: ownerUser._id,
        name: 'Green Valley Organic Homestay',
        category: 'homestay',
        description: 'Experience authentic Kerala hospitality tucked in private cardamom and tea plantations. Enjoy freshly prepared farm-to-table organic meals, early morning bird-watching walks, and cozy wooden balconies.',
        destination: destinations[0]._id,
        address: 'Tea Estate Road, Old Munnar, Kerala 685612',
        location: { lat: 10.0912, lng: 77.0621 },
        pricePerUnit: 2800,
        pricingUnit: 'per_night',
        images: [
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['Complimentary Organic Breakfast', 'Tea Garden Walks', 'High-speed WiFi', 'Mountain View Balcony', 'Campfire'],
        tags: ['wellness', 'culinary', 'trekking'],
        contactPhone: '+91 98470 11223',
        contactEmail: 'greenvalley@munnarlocal.com',
        ratingAverage: 4.9,
        reviewCount: 18,
        isVerified: true,
        operatingHours: '24/7 Check-in',
        availabilityStatus: 'available'
      },
      {
        owner: ownerUser._id,
        name: 'Highland Trail & Spice Explorer Guides',
        category: 'tour_guide',
        description: 'Guided day-treks led by native Munnar naturalists. Discover secret waterfall viewpoints, rare endemic flora including the Neelakurinji shrub, and learn traditional cardamom harvest techniques.',
        destination: destinations[0]._id,
        address: 'Bazaar Junction, Munnar Town, Kerala',
        location: { lat: 10.0881, lng: 77.0610 },
        pricePerUnit: 850,
        pricingUnit: 'per_person',
        images: [
          'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['Certified Local Guide', 'Trekking Poles Provided', 'Herbal Tea Tasting', 'First Aid Safety Kit'],
        tags: ['trekking', 'heritage', 'wildlife'],
        contactPhone: '+91 98471 22334',
        contactEmail: 'trails@munnarguides.com',
        ratingAverage: 4.8,
        reviewCount: 24,
        isVerified: true,
        operatingHours: '06:00 AM - 06:00 PM',
        availabilityStatus: 'available'
      },
      {
        owner: ownerUser._id,
        name: 'Heritage Blue Pottery & Craft Studio',
        category: 'artisan',
        description: 'Fifth-generation artisan studio offering authentic Jaipur blue pottery workshops. Learn clay formulation, quartz glazing, and hand-painting traditional floral motifs.',
        destination: destinations[1]._id,
        address: 'Kot Jeweler Lane, Amber Road, Jaipur, Rajasthan 302002',
        location: { lat: 26.9210, lng: 75.7950 },
        pricePerUnit: 500,
        pricingUnit: 'per_person',
        images: [
          'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['Hands-on Pottery Wheel', 'Artisan Mentorship', 'Take-Home Keepsake', 'Masterclass Certificate'],
        tags: ['handicrafts', 'heritage', 'cultural_festivals'],
        contactPhone: '+91 94140 33445',
        contactEmail: 'crafts@jaipurpottery.org',
        ratingAverage: 4.9,
        reviewCount: 31,
        isVerified: true,
        operatingHours: '09:30 AM - 07:00 PM',
        availabilityStatus: 'available'
      },
      {
        owner: ownerUser._id,
        name: 'The Royal Chokhi Haveli Thali',
        category: 'restaurant',
        description: 'Traditional Marwari dining experience set in a restored 150-year-old haveli. Enjoy authentic Dal Baati Churma, Gatte ki Sabzi, and bajra rotis served with warm Rajasthani hospitality and live Sarangi music.',
        destination: destinations[1]._id,
        address: 'Near Hawa Mahal, Pink City, Jaipur, Rajasthan',
        location: { lat: 26.9240, lng: 75.8270 },
        pricePerUnit: 450,
        pricingUnit: 'per_person',
        images: [
          'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['Traditional Baithak Seating', 'Live Sarangi & Folk Music', 'Unlimited Authentic Thali', 'Puppet Show'],
        tags: ['culinary', 'cultural_festivals', 'heritage'],
        contactPhone: '+91 94141 44556',
        contactEmail: 'dine@chokhihaveli.com',
        ratingAverage: 4.7,
        reviewCount: 42,
        isVerified: true,
        operatingHours: '12:00 PM - 11:00 PM',
        availabilityStatus: 'available'
      },
      {
        owner: ownerUser._id,
        name: 'Om Beach Nirvana Eco-Cottages',
        category: 'homestay',
        description: 'Sustainable thatched bamboo cottages located steps from the shores of Om Beach. Fall asleep to the sound of rolling waves, join sunrise seaside yoga, and savor fresh Konkan coastal cuisine.',
        destination: destinations[2]._id,
        address: 'North Cliff, Om Beach, Gokarna, Karnataka 581326',
        location: { lat: 14.5420, lng: 74.3160 },
        pricePerUnit: 2200,
        pricingUnit: 'per_night',
        images: [
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['Direct Beachfront Access', 'Hammocks & Sunbeds', 'Open-air Yoga Pavilion', 'Fresh Seafood Cafe'],
        tags: ['wellness', 'water_sports'],
        contactPhone: '+91 99800 55667',
        contactEmail: 'contact@nirvanacottages.com',
        ratingAverage: 4.8,
        reviewCount: 15,
        isVerified: true,
        operatingHours: '24/7 Check-in',
        availabilityStatus: 'available'
      },
      {
        owner: ownerUser._id,
        name: 'Gokarna Coastal Five-Beach Trail',
        category: 'tour_guide',
        description: 'Experience Gokarna’s legendary coastal trek crossing Kudle, Om, Half-Moon, and Paradise beaches. Our local coastal guide shares maritime folklore, secret tide pools, and dolphin watching spots.',
        destination: destinations[2]._id,
        address: 'Kudle Hilltop, Gokarna, Karnataka',
        location: { lat: 14.5450, lng: 74.3140 },
        pricePerUnit: 650,
        pricingUnit: 'per_person',
        images: [
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['Cliff Sunset Point', 'Cave Exploration', 'Local Lore Stories', 'Trekking Sticks'],
        tags: ['trekking', 'water_sports'],
        contactPhone: '+91 99801 66778',
        contactEmail: 'guide@gokarnatreks.com',
        ratingAverage: 4.9,
        reviewCount: 20,
        isVerified: true,
        operatingHours: '06:30 AM - 06:30 PM',
        availabilityStatus: 'available'
      },
      {
        owner: ownerUser._id,
        name: 'Bandipur Forest Echoes Eco Lodge',
        category: 'homestay',
        description: 'Eco-certified wilderness lodge situated at the periphery of Bandipur National Park. Constructed with solar energy and rainwater harvesting. Features evening bonfires and naturalist presentations.',
        destination: destinations[3]._id,
        address: 'Mangala Village, Gundlupet Taluk, Bandipur, Karnataka 571126',
        location: { lat: 11.6620, lng: 76.6210 },
        pricePerUnit: 3500,
        pricingUnit: 'per_night',
        images: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['Jeep Safari Assistance', 'Campfire & Stargazing', 'Organic Meals Included', 'Resident Naturalist'],
        tags: ['wildlife', 'wellness'],
        contactPhone: '+91 94480 77889',
        contactEmail: 'stay@forestechoesbandipur.com',
        ratingAverage: 4.8,
        reviewCount: 19,
        isVerified: true,
        operatingHours: '24/7 Check-in',
        availabilityStatus: 'available'
      },
      {
        owner: ownerUser._id,
        name: 'Jungle Dawn Guided Safari & Birding',
        category: 'cultural_activity',
        description: 'Join an early morning bird-watching and wildlife tracking experience with native Soliga tribal naturalists. Spot Malabar Pied Hornbills, Asian elephants, and learn traditional tracking clues.',
        destination: destinations[3]._id,
        address: 'Forest Checkpost, Bandipur National Park, Karnataka',
        location: { lat: 11.6680, lng: 76.6320 },
        pricePerUnit: 1200,
        pricingUnit: 'per_tour',
        images: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: ['High-Power Binoculars', 'Certified Naturalist Guide', 'Bird Checklist Booklet', 'Hot Herbal Chai'],
        tags: ['wildlife', 'trekking'],
        contactPhone: '+91 94481 88990',
        contactEmail: 'safari@soliganaturalists.org',
        ratingAverage: 4.9,
        reviewCount: 27,
        isVerified: true,
        operatingHours: '05:30 AM - 10:30 AM, 03:30 PM - 06:30 PM',
        availabilityStatus: 'available'
      }
    ]);
    console.log(`[Seed] Created ${businesses.length} local businesses.`);

    // 4. Create Reviews
    const reviews = await Review.create([
      {
        business: businesses[0]._id,
        tourist: touristUser._id,
        rating: 5,
        comment: 'Staying at Green Valley Homestay was the highlight of our Munnar trip! The homemade appams and fresh tea plucked straight from the garden were exquisite.'
      },
      {
        business: businesses[1]._id,
        tourist: touristUser._id,
        rating: 5,
        comment: 'Our guide was immensely knowledgeable about Western Ghats ecology and took us through breathtaking ridge paths that regular tourists miss.'
      },
      {
        business: businesses[2]._id,
        tourist: touristUser._id,
        rating: 5,
        comment: 'A deeply rewarding hands-on pottery class! Master artisan shared stories behind every royal motif. We received our glazed souvenirs carefully wrapped.'
      }
    ]);
    console.log(`[Seed] Created ${reviews.length} reviews.`);

    // 5. Create Sample Bookings
    const bookings = await Booking.create([
      {
        bookingId: 'SLT-2026-00101',
        tourist: touristUser._id,
        business: businesses[0]._id,
        startDate: new Date(Date.now() + 86400000 * 5),
        endDate: new Date(Date.now() + 86400000 * 8),
        guestsCount: 2,
        totalAmount: 8400,
        status: 'confirmed',
        specialRequests: 'Quiet room with valley view please.',
        contactPhone: '+91 98765 43210'
      },
      {
        bookingId: 'SLT-2026-00102',
        tourist: touristUser._id,
        business: businesses[1]._id,
        startDate: new Date(Date.now() + 86400000 * 6),
        endDate: new Date(Date.now() + 86400000 * 6),
        guestsCount: 2,
        totalAmount: 1700,
        status: 'pending',
        specialRequests: 'Interested in early morning 6:30 AM start for photography.',
        contactPhone: '+91 98765 43210'
      }
    ]);
    console.log(`[Seed] Created ${bookings.length} sample bookings.`);

    // 6. Create Favorite
    await Favorite.create({
      tourist: touristUser._id,
      business: businesses[0]._id
    });
    console.log('[Seed] Created sample favorite.');

    // 7. Create Sample Itinerary
    await Itinerary.create({
      tourist: touristUser._id,
      destination: destinations[0]._id,
      title: '3-Day Munnar Nature & Tea Immersion',
      daysCount: 3,
      startDate: new Date(),
      days: [
        {
          dayNumber: 1,
          theme: 'Arrival & Tea Garden Discovery',
          activities: [
            {
              timeSlot: 'Morning',
              title: 'Check-in at Green Valley Homestay & Welcome Herbal Tea',
              businessId: businesses[0]._id,
              notes: 'Settle in, admire mountain balcony view, sample homemade cardamon tea.',
              estimatedCost: 2800
            },
            {
              timeSlot: 'Afternoon',
              title: 'Walk through Old Munnar spice market and local tea factory museum',
              notes: 'Explore cardamom and cinnamon stalls, observe CTC tea manufacturing.',
              estimatedCost: 300
            },
            {
              timeSlot: 'Evening',
              title: 'Sunset viewpoint at Pothamedu with campfire dinner',
              notes: 'Catch golden hour over emerald slopes.',
              estimatedCost: 500
            }
          ]
        },
        {
          dayNumber: 2,
          theme: 'High Altitude Trekking & Wildlife',
          activities: [
            {
              timeSlot: 'Morning',
              title: 'Highland Trail Guided Trek with Naturalist',
              businessId: businesses[1]._id,
              notes: 'Meet guide at 6:30 AM. Trek toward Anamudi foothill ridges.',
              estimatedCost: 850
            },
            {
              timeSlot: 'Afternoon',
              title: 'Picnic lunch near Attukad Waterfalls',
              notes: 'Pack traditional banana-leaf meal from homestay.',
              estimatedCost: 350
            },
            {
              timeSlot: 'Evening',
              title: 'Ayurvedic herbal foot recovery massage at local wellness centre',
              notes: 'Relax after the 12km mountain trek.',
              estimatedCost: 1200
            }
          ]
        },
        {
          dayNumber: 3,
          theme: 'Lakeside Serenity & Departure',
          activities: [
            {
              timeSlot: 'Morning',
              title: 'Mattupetty Dam boat safari and Echo Point visit',
              notes: 'Peaceful boat ride surrounded by rolling hills.',
              estimatedCost: 600
            },
            {
              timeSlot: 'Afternoon',
              title: 'Artisan tea and spice shopping from regional cooperatives',
              notes: 'Support local women farmers cooperative for authentic spices.',
              estimatedCost: 1000
            }
          ]
        }
      ]
    });
    console.log('[Seed] Created sample 3-day itinerary.');

    console.log('\n======================================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY! ');
    console.log(' Sample Credentials:');
    console.log(' - Tourist: tourist@example.com / Password@123');
    console.log(' - Business Owner: owner@example.com / Password@123');
    console.log(' - Admin: admin@example.com / Password@123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();