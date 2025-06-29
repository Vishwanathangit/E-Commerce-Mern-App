import React from 'react'
import './index.css'
import Navbar from './components/common/Navbar'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import Product from './components/product/Product'
import Signup from './components/user/Signup'
import Login from './components/user/Login'
import ProductUpload from './components/product/ProductUpload'
import Checkout from './components/product/Checkout'
import { useSelector } from 'react-redux'
import NotFound from './components/common/NotFound'
import Final from './components/common/Final'

function App() {
  const { userData } = useSelector((state) => state.user);

  const authCheck = (component) => {
    return userData?.name ? component : <Navigate to="/login" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">     
      <BrowserRouter>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path='/'
              element={authCheck(<Product />)}
            />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route
              path='/productUpload'
              element={authCheck(<ProductUpload />)}
            />
            <Route
              path='/checkout'
              element={authCheck(<Checkout />)}
            />
            <Route
              path='/finalFun'
              element={authCheck(<Final />)} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App