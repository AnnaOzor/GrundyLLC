import React, { useContext } from 'react'
import './GroceryDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import GroceryItem from '../GroceryItem/GroceryItem'

const GroceryDisplay = ({category}) => {

    const {grocery_list} = useContext(StoreContext)

  return (
    <div className='grocery-display' id='grocery-display'>
        <h2>Popular groceries near you</h2>
        <div className="grocery-display-list">
            {grocery_list.map((item,index)=>{
                {console.log(category,item.category);}
                if (category === "All" || category === item.category){
                    return <GroceryItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
                }
                
            })}
        </div>
    </div>
  )
}

export default GroceryDisplay
