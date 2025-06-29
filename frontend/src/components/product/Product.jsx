import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { makeAuthenticatedRequest } from '../../service/axiosService';
import { API_METHODS } from '../../utility/constant';
import { Spin } from 'antd';

const Product = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    makeAuthenticatedRequest('api/product/', API_METHODS.GET).then((response) => {
      setProductList(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Our Products
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our curated collection of premium products designed to enhance your lifestyle
            </p>
          </div>

          {/* Products Grid */}
          {productList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productList.map((product) => (
                <div key={product.id} className="flex justify-center">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-4xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
              <p className="text-gray-600">Check back later for new products!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Product;