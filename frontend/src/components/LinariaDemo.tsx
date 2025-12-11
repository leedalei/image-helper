import { css, cx } from '@linaria/core';
import { useState } from 'react';

// 定义样式
const container = css`
  padding: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const title = css`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 16px;
  background: linear-gradient(to right, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const description = css`
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.95;
  margin-bottom: 20px;
`;

const button = css`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: white;
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const featureGrid = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const featureCard = css`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const featureTitle = css`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const featureDesc = css`
  font-size: 14px;
  opacity: 0.9;
`;

interface LinariaDemoProps {
  title?: string;
  description?: string;
}

export default function LinariaDemo({ title, description }: LinariaDemoProps) {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className={container}>
      <h2 className={title}>
        {title || '🎨 Linaria CSS-in-JS Demo'}
      </h2>
      <p className={description}>
        {description || 'Zero-runtime CSS-in-JS with the power of Vite and Babel. Styles are extracted at build time!'}
      </p>

      <button className={button} onClick={() => setClickCount(count => count + 1)}>
        Clicked {clickCount} times
      </button>

      <div className={featureGrid}>
        <div className={featureCard}>
          <h3 className={featureTitle}>⚡ Zero Runtime</h3>
          <p className={featureDesc}>
            No runtime overhead. Styles are generated at build time.
          </p>
        </div>

        <div className={featureCard}>
          <h3 className={featureTitle}>🔒 Type Safe</h3>
          <p className={featureDesc}>
            Full TypeScript support with type-safe styling.
          </p>
        </div>

        <div className={featureCard}>
          <h3 className={featureTitle}>🚀 Fast</h3>
          <p className={featureDesc}>
            Optimized for performance with Vite and modern tooling.
          </p>
        </div>

        <div className={featureCard}>
          <h3 className={featureTitle}>💪 Powerful</h3>
          <p className={featureDesc}>
            Full CSS features including nesting, media queries, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
