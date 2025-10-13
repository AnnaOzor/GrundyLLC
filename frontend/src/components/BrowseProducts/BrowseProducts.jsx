import React from 'react'
import './BrowseProducts.css'
import { product_list } from '../../assets/assets'

const BrowseProducts = ({category, setCategory}) => {

  return (
    <div className='browse-products' id= 'browse-products'>
      <h1>Browse our products</h1>
      <p className='browse-products-text'>Explore a wide selection of fresh produce, pantry staples, and household essentials sourced from trusted local markets and shops. Our mission is to make grocery shopping simple, reliable, and convenient—bringing quality and freshness to your home, every time.</p>
      <div className="browse-products-list">
        {product_list.map((item,index)=>{
          return (
            <div onClick={()=>setCategory(prev=>prev===item.product_name?"All":item.product_name)} key={index} className='browse-products-list-item'>
              <img className={category===item.product_name?"active":""} src={item.product_image} alt="" />
              <p>{item.product_name}</p>
            </div>
          )
        })}
      </div>
      <hr />
    </div>
  )
}

export default BrowseProducts
