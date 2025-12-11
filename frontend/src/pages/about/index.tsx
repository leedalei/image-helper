import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

function About() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">关于</h1>
          <p className="text-gray-600 mt-1">
            Image Helper - 现代图片处理应用
          </p>
        </div>
        <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About Image Helper</CardTitle>
            <CardDescription>
              A modern image processing application built with cutting-edge technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This application demonstrates the integration of modern web technologies including
              React 19 with React Compiler, Vite 7, TailwindCSS V4, and more.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
            <CardDescription>Built with the latest and greatest</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-3 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                <div>
                  <strong>React 19</strong>
                  <p className="text-sm text-gray-600">
                    Latest React with automatic React Compiler optimization
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                <div>
                  <strong>Vite 7</strong>
                  <p className="text-sm text-gray-600">
                    Next generation frontend tooling for instant HMR
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                <div>
                  <strong>TailwindCSS V4</strong>
                  <p className="text-sm text-gray-600">
                    Utility-first CSS framework with CSS-in-JS capabilities
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                <div>
                  <strong>React Router v6</strong>
                  <p className="text-sm text-gray-600">
                    Declarative routing for React with configuration-based routing
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                <div>
                  <strong>Zustand</strong>
                  <p className="text-sm text-gray-600">
                    Small, fast and scalable state management
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                <div>
                  <strong>shadcn/ui</strong>
                  <p className="text-sm text-gray-600">
                    Beautifully designed, accessible components
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>What makes this app special</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">⚡ React Compiler</h3>
                <p className="text-sm text-gray-600">
                  Automatic component optimization with zero configuration
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">🚀 Vite 7</h3>
                <p className="text-sm text-gray-600">
                  Lightning fast HMR and optimized builds
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">🎨 TailwindCSS V4</h3>
                <p className="text-sm text-gray-600">
                  Modern CSS framework with native cascade layers
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">📦 Modular Architecture</h3>
                <p className="text-sm text-gray-600">
                  Clean, maintainable, and scalable codebase
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}

export default About;
