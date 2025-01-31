// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import Header from './components/header/header';
import Footer from './components/footer/footer';
// import Upload from './pages/Upload/Upload';
// import DocumentDetails from './pages/DocumentDetails/DocumentDetails';

const App = () => {
  return (
    <Router>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/upload" element={<Upload />} />
                <Route path="/document-details" element={<DocumentDetails />} /> */}
      </Routes>
      <Footer></Footer>
    </Router>
  );
};

export default App;
