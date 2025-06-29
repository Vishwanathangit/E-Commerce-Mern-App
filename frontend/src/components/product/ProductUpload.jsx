import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../store/productStore';
import { Alert } from 'antd';

const ProductUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageBase64: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [successFlag, setSuccessFlag] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size exceeds 5MB. Please select a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prevData) => ({
          ...prevData,
          imageBase64: reader.result,
        }));
        setErrorMessage(null); // Clear any previous error
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.price || !formData.imageBase64) {
      setErrorMessage('Please fill all fields and select an image.');
      return;
    }
    try {
      dispatch(createProduct(formData)).then((response) => {
        if (!response.error) {
          setSuccessFlag(true);
          setMessage('Product uploaded successfully');
          setFormData({
            title: '',
            description: '',
            price: '',
            imageBase64: '',
          });
          setPreviewImage(null);
          navigate('/'); // Redirect to product listing page
        } else {
          setErrorMessage(response.error.message || 'Failed to upload product.');
        }
      });
    } catch (err) {
      setErrorMessage('An error occurred while uploading the product.');
      console.error(err);
    }
  };

  return (
    <div className="modal-container bg-white w-96 mx-auto mt-24 p-4 rounded shadow">
      <h3 className="text-lg text-gray-800 font-bold text-center mb-3">Product Upload</h3>
      {successFlag && <Alert message={message} type="success" showIcon closable />}
      {error && <Alert message={error} type="error" showIcon closable />}
      {errorMessage && <Alert message={errorMessage} type="error" showIcon closable />}
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md"
        />

        <label htmlFor="description" className="block mt-2 text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md"
        ></textarea>

        <label htmlFor="price" className="block mt-2 text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md"
        />

        <label htmlFor="image" className="block mt-2 text-sm font-medium text-gray-700">
          Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 p-2 w-full border rounded-md"
        />
        {previewImage && (
          <div>
            <label htmlFor="imagePreview" className="block mt-2 text-sm font-medium text-gray-700">
              Preview
            </label>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full h-auto mb-4 rounded"
            />
          </div>
        )}
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="mt-4 bg-blue-500 text-white p-2 rounded-md text-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpload;