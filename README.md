# Smart AgriConnect (frontend demo)

React + TypeScript + Vite + React Router. Frontend only: no backend, database or paid services.
All data (weather, prices, scans, tracking) is local sample data for demonstration.

## Run

```bash
cd ~/Desktop/AgriConnect
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

## Screens
- `/` Home dashboard · `/scan` Scan Crop · `/scan/results` Scan Results
- `/market` Crop Market · `/product/:id` Product Details
- `/assistant` AI Pricing Assistant · `/orders` Orders · `/orders/:id` Order Tracking
- `/soil` Soil Health · `/schemes` Schemes (extra pages in the same style)

## Demo tips
- Click the sample leaf on Home to run a demo scan, or upload / drag-drop / take a photo.
- Place an order from a product page. Tracking advances by itself every 20 seconds, or use "Simulate update".
- Top-right user menu -> "Reset demo data" clears saved orders and scans.
- Orders, last scan and location are kept in localStorage.

## Small differences from the Figma frames (data/logic fixes)
- Typos fixed: "Let's", "Recommended", "Early Blight", "Delivery".
- Greeting follows the time of day (Good Morning / Afternoon / Evening).
- One price per product (tomato Rs 20/kg) so market, product page and orders agree.
- Price trend chart labelled with the last 30 days; Delivery progress ring shows real progress.
- Place order button text is white for contrast.
- Sidebar shade follows the frames (darker on Home/Scan/Market, lighter on Product/Pricing/Orders).
