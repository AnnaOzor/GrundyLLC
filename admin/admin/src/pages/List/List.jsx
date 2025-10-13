import React, { useState, useEffect } from 'react';
import './List.css';
import axios from "axios";
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    category: "Fresh Produce",
    price: "",
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const token = localStorage.getItem('adminToken'); // admin token
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchList = async () => {
    if (!token) return toast.error("You must be logged in as admin");

    try {
      const response = await axios.get(`${url}/api/grocery/list`, axiosConfig);
      if (response.data.success) setList(response.data.data);
      else toast.error("Error fetching groceries");
    } catch (error) {
      console.error("Fetch groceries error:", error.response || error);
      toast.error("Server error fetching groceries");
    }
  };

  const removeGrocery = async (id) => {
    if (!token) return toast.error("You must be logged in as admin");

    try {
      const response = await axios.post(`${url}/api/grocery/remove`, { id }, axiosConfig);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else toast.error("Error removing grocery");
    } catch (error) {
      console.error("Remove grocery error:", error.response || error);
      toast.error("Server error removing grocery");
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditData({ name: item.name, description: item.description || "", category: item.category, price: item.price, image: null });
    setPreviewImage(`${url}/uploads/${item.image}`);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("You must be logged in as admin");

    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("description", editData.description);
      formData.append("category", editData.category);
      formData.append("price", Number(editData.price));
      if (editData.image) formData.append("image", editData.image);

      const response = await axios.put(`${url}/api/grocery/edit/${editingItem._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("Grocery item updated successfully!");
        setEditingItem(null);
        fetchList();
      } else toast.error("Update failed!");
    } catch (error) {
      console.error("Update grocery error:", error.response || error);
      toast.error("Error updating grocery");
    }
  };

  const closeModal = () => {
    setEditingItem(null);
    setPreviewImage(null);
  };

  useEffect(() => { fetchList(); }, []);

  return (
    <div className='list add flex-col'>
      <p>All Groceries List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b><b>Name</b><b>Category</b><b>Price</b><b>Action</b>
        </div>

        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/uploads/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₦{Number(item.price).toLocaleString()}</p>
            <div className="action-buttons">
              <button onClick={() => handleEditClick(item)} className='edit-btn'>Edit</button>
              <button onClick={() => removeGrocery(item._id)} className='delete-btn'>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Grocery Item</h3>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <label>Name</label>
              <input type="text" name="name" value={editData.name} onChange={handleEditChange} required />

              <label>Description</label>
              <textarea name="description" value={editData.description} onChange={handleEditChange}></textarea>

              <label>Category</label>
              <select name="category" value={editData.category} onChange={handleEditChange} required>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Fruits">Fruits</option>
                <option value="Roots and Tubers">Roots and Tubers</option>
                <option value="Grains and Staple Foods">Grains and Staple Foods</option>
                <option value="Proteins">Proteins</option>
                <option value="Oils and Spices">Oils and Spices</option>
                <option value="Packaged Foods and Beverages">Packaged Foods and Beverages</option>
                <option value="Household Essentials">Household Essentials</option>
              </select>

              <label>Price</label>
              <input type="number" name="price" value={editData.price} onChange={handleEditChange} required />

              <label>Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {previewImage && <div className="image-preview"><img src={previewImage} alt="Preview" /></div>}

              <div className="modal-buttons">
                <button type="submit" className="save-btn">Save changes</button>
                <button type="button" onClick={closeModal} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
