import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import LinariaDemo from '../components/LinariaDemo';

function Home() {
  const [name, setName] = useState<string>('');
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Image Helper</CardTitle>
              <CardDescription>
                A modern image processing application built with cutting-edge technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This app is powered by React 19, Vite 7, TailwindCSS V4, and more!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zustand State Management</CardTitle>
              <CardDescription>Test the state management with the counter below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-2xl font-bold">Counter: {count}</p>
                <Button onClick={increment} className="w-full">
                  Increment Counter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>React Compiler Demo</CardTitle>
              <CardDescription>React 19 automatically optimizes your components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter your name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                    placeholder="Type here..."
                  />
                </div>
                {name && (
                  <p className="text-green-600 font-medium">
                    Hello, {name}! React Compiler is automatically optimizing your components! 🚀
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Linaria CSS-in-JS Demo</CardTitle>
              <CardDescription>Zero-runtime CSS-in-JS with TypeScript support</CardDescription>
            </CardHeader>
            <CardContent>
              <LinariaDemo />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
