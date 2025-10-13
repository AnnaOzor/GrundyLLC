import React, { useContext} from 'react'
import './GroceryItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const GroceryItem = ({id,name,price,description,image}) => {

    
    const {cartItems,addToCart,removeFromCart,url} = useContext(StoreContext);

  return (
    <div className='grocery-item'>
        <div className="grocery-item-img-container">
            <img className='grocery-item-image' src={url+"/uploads/"+image} alt="" />


            {!cartItems[id]
                ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
                : <div className='grocery-item-counter'>
                    <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                    <p>{cartItems[id]}</p>
                    <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
                </div>
            }
        </div>
        <div className="grocery-item-info">
            <div className="grocery-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
            <p className="grocery-item-desc">{description}</p>
            <p className="grocery-item-price"> ₦{Number(price).toLocaleString()}</p>
        </div>
    </div>
  )
}

export default GroceryItem
