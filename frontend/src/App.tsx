import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import Layout from './components/Layout';
import { routes, defaultPath } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route element={<Layout />}>
            {routes.map((route) => {
              const Component = route.element;
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Suspense fallback={
                      <div className="h-full flex items-center justify-center">
                        <div className="text-gray-600">加载中...</div>
                      </div>
                    }>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
            <Route path="*" element={<Navigate to={defaultPath} replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
