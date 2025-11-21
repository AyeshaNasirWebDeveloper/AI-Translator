import CallUI from './components/CallUI';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="py-4 px-6">
        <h1 className="text-2xl font-bold">Real-Time Voice Translation</h1>
      </header>
      <main className="p-6">
        <CallUI />
      </main>
    </div>
  );
}

export default App;
