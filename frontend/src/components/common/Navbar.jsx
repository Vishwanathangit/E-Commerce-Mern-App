import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../store/userStore";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { Badge } from "antd";

const Navbar = () => {
    const { userData, checkoutProducts } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 shadow-xl border-b border-indigo-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-2 rounded-lg">
                                <span className="text-white font-bold text-lg">EC</span>
                            </div>
                            <span className="text-white text-xl font-bold tracking-wide">E Commerce</span>
                        </Link>
                    </div>
                    
                    {/* User Section */}
                    {userData?.name ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-indigo-200 text-sm font-medium">
                                Welcome, <span className="text-white font-semibold">{userData?.name}</span>
                            </span>
                            
                            {/* Admin Actions */}
                            {userData?.isAdmin && (
                                <button 
                                    onClick={() => navigate("/productUpload")} 
                                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <PlusOutlined className="text-sm" />
                                    <span>Add Product</span>
                                </button>
                            )}
                            
                            {/* Shopping Cart */}
                            <div className="relative">
                                <Badge 
                                    count={checkoutProducts.length} 
                                    size="small"
                                    className="cursor-pointer"
                                >
                                    <div 
                                        className="bg-indigo-700 hover:bg-indigo-600 p-3 rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
                                        onClick={() => navigate("/checkout")}
                                    >
                                        <ShoppingCartOutlined className="text-white text-lg" />
                                    </div>
                                </Badge>
                            </div>
                            
                            {/* Logout Button */}
                            <button 
                                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                onClick={() => dispatch(clearUser())}
                            >
                                <LogoutOutlined className="text-sm" />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link 
                                to="/login" 
                                className="text-indigo-200 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-indigo-800"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;