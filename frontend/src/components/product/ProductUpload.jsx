import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../store/productStore';
import { CloudUploadOutlined, PictureOutlined } from '@ant-design/icons';

const ProductUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageBase64: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [successFlag, setSuccessFlag] = useState(false);
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
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size exceeds 5MB. Please select a smaller image.');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Please select a valid image file (JPG, PNG, GIF, WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        setFormData((prevData) => ({
          ...prevData,
          imageBase64: base64String,
        }));
        setErrorMessage(null);
      };
      
      // Make sure to read as data URL to get proper base64 format
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      setErrorMessage('Please enter a product title.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Please enter a product description.');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setErrorMessage('Please enter a valid price.');
      return;
    }
    if (!formData.imageBase64) {
      setErrorMessage('Please select an image.');
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price), // Ensure price is a number
      };

      const response = await dispatch(createProduct(productData));
      
      if (!response.error) {
        setSuccessFlag(true);
        // Reset form
        setFormData({
          title: '',
          description: '',
          price: '',
          imageBase64: '',
        });
        setPreviewImage(null);
        setErrorMessage(null);
        
        // Redirect after 2 seconds
        setTimeout(() => navigate('/'), 2000);
      } else {
        setErrorMessage(response.error.message || 'Failed to upload product.');
      }
    } catch (err) {
      setErrorMessage('An error occurred while uploading the product.');
      console.error('Upload error:', err);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData((prevData) => ({
      ...prevData,
      imageBase64: '',
    }));
    // Reset file input
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center justify-center mb-4">
              <CloudUploadOutlined className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Upload Product</h2>
            <p className="mt-2 text-gray-600">Add a new product to your store</p>
          </div>

          {/* Success Message */}
          {successFlag && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-green-400 text-xl">✅</span>
                </div>
                <div className="ml-3">
                  <p className="text-green-800 font-medium">Product uploaded successfully!</p>
                  <p className="text-green-600 text-sm">Redirecting to products page...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(error || errorMessage) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 font-medium">
                    {error || errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-400 transition-colors duration-200">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
                
                {previewImage ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full h-48 object-cover mx-auto rounded-lg shadow-md"
                        onError={(e) => {
                          console.error('Image preview error:', e);
                          setErrorMessage('Failed to load image preview. Please try another image.');
                        }}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <label htmlFor="image" className="cursor-pointer block text-center">
                      <p className="text-emerald-600 font-medium">Click to change image</p>
                    </label>
                  </div>
                ) : (
                  <label htmlFor="image" className="cursor-pointer block text-center">
                    <div className="space-y-4">
                      <PictureOutlined className="text-gray-400 text-4xl" />
                      <div>
                        <p className="text-gray-600 font-medium">Click to upload image</p>
                        <p className="text-gray-400 text-sm">Supports JPG, PNG, GIF, WebP (Max 5MB)</p>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || successFlag}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading Product...
                </div>
              ) : successFlag ? (
                "✅ Product Uploaded!"
              ) : (
                "Upload Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpload;