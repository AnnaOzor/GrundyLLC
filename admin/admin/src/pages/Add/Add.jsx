import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from 'react-toastify';

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Fresh Produce",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  // Get admin token
  const token = localStorage.getItem('adminToken');

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("You must be logged in as admin");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", Number(data.price));
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const response = await axios.post(`${url}/api/grocery/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          category: "Fresh Produce",
          price: "",
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Add grocery error:", error.response || error);
      toast.error("Server error adding grocery");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' required />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select name="category" value={data.category} onChange={onChangeHandler} required>
              <option value="Fresh Produce">Fresh Produce</option>
              <option value="Fruits">Fruits</option>
              <option value="Roots and Tubers">Roots and Tubers</option>
              <option value="Grains and Staple Foods">Grains and Staple Foods</option>
              <option value="Proteins">Proteins</option>
              <option value="Oils and Spices">Oils and Spices</option>
              <option value="Packaged Foods and Beverages">Packaged Foods and Beverages</option>
              <option value="Household Essentials">Household Essentials</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="₦1,000" required />
          </div>
        </div>
        <button type='submit' className='add-btn' disabled={loading}>
          {loading ? "Adding..." : "ADD"}
        </button>
      </form>
    </div>
  );
}

export default Add;
