import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../store/userStore";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";

const Navbar = () => {
    const { userData, checkoutProducts } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <>
            <nav className="bg-gray-800 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/"><span className="text-white text-lg font-semibold">EMCKart</span></Link>
                    </div>
                    { userData?.name ?
                    <div className="flex items-center">
                        <label className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Welcome {userData?.name}!</label>
                        {userData?.isAdmin && <button onClick={() => {navigate("/productUpload")}} className="bg-blue-600 text-white p-2 rounded-md mr-2">Add Product</button>}
                        <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 font-medium rounded" onClick={() => dispatch(clearUser())}>Logout</button>
                        <Badge size="small" count={checkoutProducts.length}>
                            <ShoppingCartOutlined style={{ fontSize: '24px', color: '#08c', marginLeft: '5px' }} onClick={() => {navigate("/checkout")}} />
                        </Badge>
                    </div> :
                    <div className="flex items-center">
                        <a href="/login" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Login</a>
                        <a href="/signup" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Sign up</a>
                    </div>
                    }
                </div>
            </nav>
        </>
     );
}

export default Navbar;