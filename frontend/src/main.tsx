import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 启用React Compiler
// React 19自动启用React Compiler，无需额外配置
const container = document.getElementById('app');
if (!container) {
  throw new Error('Failed to find the app element');
}

const root = createRoot(container);
root.render(<App />);
