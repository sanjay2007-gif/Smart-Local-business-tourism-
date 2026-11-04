# Smart Local Tourism Business Portal (TerraLocal) 🌿🏔️

A modern, responsive full-stack web application designed to connect tourists directly with local tourism businesses—including homestays, licensed tour guides, indigenous artisans, cultural kitchens, restaurants, and regional service providers.

Built with a nature-inspired design (emerald green, deep forest, and cream) to champion community-first, sustainable travel with zero middleman commissions.

---

## 🌟 Key Highlights & Features

1. **Destinations Explorer**: Discover regional havens (e.g. Munnar Tea Highlands, Jaipur Royal Heritage, Gokarna Coastal Sanctuary, Bandipur Wildlife Reserve) with highlights and best seasonal visiting windows.
2. **Local Business Catalog & Multi-Filter**: Filter by category (`homestay`, `tour_guide`, `artisan`, `restaurant`, `cultural_activity`), destination, budget range, and minimum star rating.
3. **Interactive OpenStreetMap with Leaflet**: Color-coded geographic pins with image preview popups, coordinates, and direct booking links.
4. **Day-Wise Itinerary Planner**: Instant day-by-day scheduler connecting real local businesses into Morning, Afternoon, and Evening activities with estimated costs.
5. **Smart Personalized Recommendations**: Matches user interests (`#trekking`, `#culinary`, `#handicrafts`, `#wildlife`) against business tags and scores relevance.
6. **Location-Based Proximity Discovery (GPS)**: Uses the **Haversine formula** to calculate true great-circle distance in kilometers from browser GPS coordinates to local hosts.
7. **Direct Booking Engine**: Dynamic pricing calculation based on guests/nights, generating unique readable booking IDs (e.g. `SLT-2026-XXXXX`).
8. **5-Star Community Review System**: Automated Mongoose aggregation hooks recalculating average ratings and review counts upon submission.
9. **Role-Based Dashboards**:
   - **Tourist Dashboard**: My Bookings (with status and cancellation), Saved Favorites, My Saved Itineraries, and Profile & Interest management.
   - **Business Owner Dashboard**: Listing creation & management, incoming booking approvals (Confirm / Decline / Complete), and earnings tracking.
   - **Admin Central Console**: Platform analytics (Tourists, Owners, Verified Businesses, Platform Revenue), business verification toggles, and user management.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Context API |
| **Styling** | Tailwind CSS (Custom emerald/forest theme), PostCSS |
| **Maps** | Leaflet, React-Leaflet, OpenStreetMap tiles |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js REST API |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing |
| **HTTP Client** | Axios (with token interceptors) |

---

## 📂 Project Architecture

```
smart-local-tourism-portal/
├── backend/
│   ├── config/db.js                 # MongoDB connection logic
│   ├── controllers/                 # REST controllers (auth, business, booking, etc.)
│   ├── middleware/authMiddleware.js # JWT & role verification (tourist/owner/admin)
│   ├── models/                      # 7 Mongoose Schemas (User, Business, Booking, etc.)
│   ├── routes/                      # Express route endpoints
│   ├── seed/seedData.js             # Realistic sample data script
│   ├── .env.example                 # Environment configuration template
│   ├── package.json
│   └── server.js                    # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/axiosClient.js       # Axios with JWT interceptors
│   │   ├── components/
│   │   │   ├── common/              # Navbar, Footer
│   │   │   ├── cards/               # BusinessCard, DestinationCard
│   │   │   ├── map/                 # Leaflet TourismMap
│   │   │   └── forms/               # BookingModal, ReviewModal
│   │   ├── context/                 # AuthContext, ToastContext
│   │   ├── pages/                   # All 11 responsive portal pages
│   │   ├── App.jsx                  # Main routing tree
│   │   └── index.css                # Tailwind directives & custom styling
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local Community Server or free MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/sanjay2007-gif/Smart-Local-business-tourism-.git
cd Smart-Local-business-tourism-
```

### 2. Configure Backend
```bash
cd backend
npm install
cp .env.example .env
```
*(Optionally edit `MONGO_URI` in `.env` if using a custom MongoDB host or cloud Atlas URI).*

### 3. Seed Realistic Tourism Data
```bash
npm run seed
```

### 4. Start the Application
- **Start Backend**:
  ```bash
  npm run dev
  # Server running on http://localhost:5000
  ```

- **Start Frontend** (in a separate terminal):
  ```bash
  cd ../frontend
  npm install
  npm run dev
  # Vite app running on http://localhost:5173
  ```

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Tourist** | `tourist@example.com` | `Password@123` |
| **Business Owner** | `owner@example.com` | `Password@123` |
| **Platform Admin** | `admin@example.com` | `Password@123` |

*(Fast-fill buttons are also available directly on the login screen for one-click testing).*

---

## 🔮 Future Architecture Readiness
The system is built modularly and structured for upcoming integrations:
- **ML & NLP Recommendation Agent**: Content-based filtering and conversational chatbot assistant.
- **Dynamic Pricing Engine**: High/low tourist season rate adjustments.
- **UPI & Payment Gateways**: Seamless local merchant payouts.
- **AR/VR Virtual Preview**: 360° tours of homestays and heritage monuments.
- **Blockchain Verification**: Immutable tamper-proof reviews.

---

## 📄 License
ISC License © 2026 Smart Local Tourism Business Portal.