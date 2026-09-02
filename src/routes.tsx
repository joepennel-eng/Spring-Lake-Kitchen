import { RouteObject } from 'react-router';
import HomePage from './pages/index';
import MenuPage from './pages/menu';
import CustomOrdersPage from './pages/custom-orders';
import OrderReceivedPage from './pages/order-received';
import NotFoundPage from './pages/_404';

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/menu', element: <MenuPage /> },
  { path: '/custom-orders', element: <CustomOrdersPage /> },
  { path: '/order-received', element: <OrderReceivedPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export type Path = '/' | '/menu' | '/custom-orders' | '/order-received';
export type Params = Record<string, string | undefined>;
