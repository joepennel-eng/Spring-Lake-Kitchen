import { Suspense } from 'react';
import { Outlet, createBrowserRouter, type RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import RootLayout from './layouts/RootLayout';
import Spinner from './components/Spinner';
import { routes } from './routes';

const SpinnerFallback = () => (
  <div className="flex h-screen items-center justify-center py-8">
    <Spinner />
  </div>
);

const routeTree: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<SpinnerFallback />}>
        <RootLayout>
          <Outlet />
        </RootLayout>
      </Suspense>
    ),
    children: routes,
  },
];

const router = createBrowserRouter(routeTree);

export default function App() {
  return <RouterProvider router={router} />;
}
