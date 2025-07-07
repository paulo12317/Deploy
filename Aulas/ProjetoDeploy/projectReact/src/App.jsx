import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import AppRoutes from './routes'

function App() {
  

  return (
    <>
      <AppRoutes/>
      <h1>Ola</h1>
      <Footer/>
    </>
  )
}

export default App
