import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './components/AppContext';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Scan from './pages/Scan';
import ScanResults from './pages/ScanResults';
import Market from './pages/Market';
import ProductDetails, { ProductIndex } from './pages/ProductDetails';
import Pricing from './pages/Pricing';
import SoilHealth from './pages/SoilHealth';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import Schemes from './pages/Schemes';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="scan" element={<Scan />} />
            <Route path="scan/results" element={<ScanResults />} />
            <Route path="market" element={<Market />} />
            <Route path="product" element={<ProductIndex />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="assistant" element={<Pricing />} />
            <Route path="soil" element={<SoilHealth />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderTracking />} />
            <Route path="schemes" element={<Schemes />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
