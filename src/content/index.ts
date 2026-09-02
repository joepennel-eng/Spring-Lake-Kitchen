import home from './pages/home.json';
import menu from './pages/menu.json';
import custom_orders from './pages/custom_orders.json';
import order_received from './pages/order_received.json';
import catalog from './catalog-snapshot.json';

export { home, menu, custom_orders, order_received };
export const products = catalog.products;
export type Product = (typeof catalog.products)[number];
