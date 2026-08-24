import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <ChatInterface />
    </main>
  );
}