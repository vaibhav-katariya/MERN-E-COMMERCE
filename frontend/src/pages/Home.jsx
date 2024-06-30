import React from 'react'
import GetCategoryWiseOneProduct from '../components/GetCategoryWiseOneProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <GetCategoryWiseOneProduct />
      <VerticalCardProduct category={"mobiles"} heading={"Mobiles"}/>
    </div>
  )
}

export default Home
