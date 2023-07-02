import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navbar, Footer } from './Components/Layout';
import Home from './Components/Home';
import Products from './Components/Products';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
        </Routes>
        <Footer />
      </Router>
    </>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);