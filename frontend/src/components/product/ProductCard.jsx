import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductTOCheckout } from '../../store/userStore';

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { checkoutProducts } = useSelector((state) => state.user);
  const isProductAddedForCheckout = checkoutProducts.findIndex(checkoutProduct => checkoutProduct.id === product.id) === -1;

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative max-w-xs rounded overflow-hidden shadow-lg">
      <img
        className="w-60 h-60"
        src={product.imageBase64} // Changed from imageUrl to imageBase64
        alt="Product"
        onLoad={handleImageLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{product.title}</div>
        <p className="text-gray-700 text-base">{product.description}</p>
      </div>
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          ${product.price}
        </span>
        <button
          className={"text-white font-bold py-2 px-4 rounded " + (isProductAddedForCheckout ? "bg-blue-500 hover:bg-blue-700" : "bg-red-500 hover:bg-red-700")}
          onClick={() => dispatch(addProductTOCheckout(product))}
        >
          {isProductAddedForCheckout ? "Add to Cart" : "Remove"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;