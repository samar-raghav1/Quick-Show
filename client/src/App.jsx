
import  Home  from "./pages/Home"
import React from 'react'
import { Routes,Route, useLocation } from 'react-router-dom'
import Movies from "./pages/Movies"
import MovieDetails from "./pages/MovieDetails"
import Seatlayout from "./pages/Seatlayout"
import MyBooking from "./pages/MyBooking"
import Favorite from "./pages/Favorite"
import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"
import Footer from "./components/Footer"

const App = () => {
  const isAdminRoute=useLocation().pathname.startsWith('/')
  return (
    <>
    <Toaster/>
    {isAdminRoute&&  <Navbar/>}
     
      <Routes>
       <Route path="/" element={<Home/>} />
       <Route path="/movies" element={<Movies/>} />
       <Route path="/movies/:id" element={<MovieDetails/>} />
       <Route path="/movies/:id/:date" element={<Seatlayout/>} />
       <Route path="/my-bookings" element={<MyBooking/>} />
       <Route path="/favorite" element={<Favorite/>} />
      </Routes>
       {isAdminRoute&&  <Footer/>}
    </>
  )
}

export default App
