import React from 'react'
import GetCategoryWiseOneProduct from '../components/GetCategoryWiseOneProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <GetCategoryWiseOneProduct />
      <HorizontalCardProduct  category={"watches"} heading={"Popular's Watches"} />
      <HorizontalCardProduct category={"Airdopes"} heading={"Top's Airpodes"}/>

      <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"}/>
      <VerticalCardProduct category={"TV"} heading={"Televisions"}/>
      <VerticalCardProduct category={"mobiles"} heading={"Mobiles"}/>
    </div>
  )
}

export default Home
