import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import BrowseProducts from '../../components/BrowseProducts/BrowseProducts'
import GroceryDisplay from '../../components/GroceryDisplay/GroceryDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <BrowseProducts category={category} setCategory={setCategory} />
      <GroceryDisplay category={category} />


      <AppDownload />
    </div>
  )
}

export default Home