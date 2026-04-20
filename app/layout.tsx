import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yacht Workspace',
  description: 'Agentic browser workspace for launching waitlist pages'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
