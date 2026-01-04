/* eslint-disable react/prop-types */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { LuUsers } from "react-icons/lu";
import { TbBrandWechat, TbReport } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { IoCloseSharp, IoLogOutOutline } from "react-icons/io5";
import {
  MdAdminPanelSettings,
  MdLocalHospital,
  MdOutlineAssignment,
  MdOutlineInventory2,
} from "react-icons/md";
import { RiFlaskLine } from "react-icons/ri";
import { BsReceipt } from "react-icons/bs";
import { RiCoupon4Line } from "react-icons/ri";
import { message } from "antd";
import { useLogoutMutation } from "../../redux/api/authApi";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;
  const [logout, { isLoading }] = useLogoutMutation();
  
  // Close sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      message.success('Logged out successfully');
      navigate('/sign-in');
    } catch (error) {
      message.error('Failed to logout');
      // Still navigate to sign-in page even if API call fails
      navigate('/sign-in');
    }
  };

  return (
    <div
      className={`bg-[#fff] text-[#111826] border border-[#E5E7EB] h-screen overflow-y-auto py-5 md:py-0 z-50 transition-transform shadow-lg my-5 rounded-lg shadow-[0_0_10px_0_rgba(0,0,0,0.1)]
        w-[80%] sm:w-[70%] md:w-[60%] lg:w-70 xl:w-72
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        fixed top-0 left-0
        lg:static lg:translate-x-0
      `}
    >
      {/* Close Button (Mobile Only) */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 lg:hidden text-white bg-[#111826] focus:outline-none p-2 rounded-full"
      >
        <IoCloseSharp />
      </button>

      {/* Logo */}
      <div className="flex justify-center items-center gap-2 px-5 mt-20">
        <img src="/logo.png" className="w-[150px] h-[80px]" alt="User Avatar" />
      </div>

      {/* Sidebar Menu */}
      <ul className="mt-10 px-5 text-[10px]">
        {/* Dashboard Page */}
        <Link to="/" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/")
                ? "bg-[#111826] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <RxDashboard className="w-5 h-5" />
            <p className="text-lg font-semibold">Dashboard</p>
          </li>
        </Link>
        {/* User Management */}
        <Link to="/user-details" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/user-details")
                ? "bg-[#111826] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <LuUsers className="w-5 h-5" />
            <p className="text-lg font-semibold">All Users</p>
          </li>
        </Link>
       

       
      
        {/* Lab Management */}
        {/* <Link to="/payment-management" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/payment-management")
                ? "bg-[#111826] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <RiFlaskLine className="w-5 h-5" />
            <p className="text-lg font-semibold whitespace-nowrap">Payments</p>
          </li>
        </Link> */}


        {/* Invoices */}
        <Link to="/invoices" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/invoices")
                ? "bg-[#111826] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <BsReceipt className="w-5 h-5" />
            <p className="text-lg font-semibold">Invoices</p>
          </li>
        </Link>

        <Link to="/create-admin">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/create-admin")
                ? "bg-[#111826] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <MdAdminPanelSettings className="w-5 h-5" />
            <p className="text-lg font-semibold">Create Admin</p>
          </li>
        </Link>

      
         <Link to="/subscriptions">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/subscriptions")
                ? "bg-[#111826] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <TbReport className="w-5 h-5" />
            <p className="text-lg font-semibold">Subscriptions</p>
          </li>
        </Link>
        <Link to="/coupon">
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/coupon")
                ? "bg-[#111826] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <RiCoupon4Line className="w-5 h-5" />
            <p className="text-lg font-semibold">Coupon</p>
          </li>
        </Link>
         <Link to="/blog">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/blog")
                ? "bg-[#111826] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <TbReport className="w-5 h-5" />
            <p className="text-lg font-semibold">Blog</p>
          </li>
        </Link>
        
        <Link to="/settings">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/settings")
                ? "bg-[#111826] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <IoMdSettings className="w-5 h-5 text-lg font-semibold" />
            <p className="text-lg font-semibold">Settings</p>
          </li>
        </Link>
      </ul>

      {/* Logout Button */}
      <div className="absolute mt-8 md:mt-20 mmd:mt-20 w-full px-5 text-[#111826]">
        <button 
          onClick={handleLogout}
          disabled={isLoading}
          className={`flex items-center gap-4 w-full py-3 rounded-lg bg-red-600 px-3 duration-200 text-white justify-center ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
          }`}
        >
          <IoLogOutOutline className="w-5 h-5 font-bold" />
          <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
