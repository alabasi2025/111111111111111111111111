import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<div className="p-8 text-center"><h1 className="text-4xl font-bold">النظام المحاسبي الذكي</h1></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
