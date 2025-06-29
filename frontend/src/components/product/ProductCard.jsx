import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductTOCheckout } from '../../store/userStore';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { checkoutProducts } = useSelector((state) => state.user);
  const isInCart = checkoutProducts.some(p => p.id === product.id);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    console.error('Failed to load product image:', product.title);
  };

  const handleCartAction = () => {
    // Since addProductTOCheckout already handles toggle functionality
    // (adds if not present, removes if present), we just need to dispatch it
    dispatch(addProductTOCheckout(product));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        )}
        {imageError ? (
          <div className="h-full flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500 text-sm mt-2">Image not available</p>
            </div>
          </div>
        ) : (
          <img
            src={product.imageBase64 || product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-600">
            ₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </span>
          <button
            onClick={handleCartAction}
            className={`${
              isInCart
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600'
            } text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg`}
          >
            {isInCart ? 'Remove' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;