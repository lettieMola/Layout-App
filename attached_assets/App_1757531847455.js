import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditorScreen from './screens/EditorScreen';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EditorScreen />} />
          <Route path="/editor" element={<EditorScreen />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;