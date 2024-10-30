import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/LogIn';
import Home from './components/Home';
import Save from './components/Save';
import Edit from './components/Edit';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/save" element={<Save />} />
        <Route path="/edit/:id" element={<Edit />} />HashRouter
      </Routes>
    </Router>
  );
};

export default App;