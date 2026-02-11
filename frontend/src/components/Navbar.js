// import React from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext";

// function Navbar({ transparent = false }) {
//   const { user,setUser } = useAuth();
//   //const { user, setUser } = useAuth();

//   return (
//     <nav
//       className={`sticky top-0 z-50 w-full border-b ${
//         transparent ? "bg-white/80 backdrop-blur-xl" : "bg-white"
//       } border-slate-200`}
//     >
//       <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//         <Link
//           to="/"
//           className="flex items-center space-x-2"
//           data-testid="home-link"
//         >
//           <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-xl">H</span>
//           </div>
//           <span className="text-xl font-bold text-slate-900">HomePros</span>
//         </Link>

//         <div className="hidden md:flex items-center space-x-8">
//           <Link
//             to="/services"
//             className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
//             data-testid="services-nav-link"
//           >
//             Services
//           </Link>
//           {/* <Link to="/login" data-testid="login-nav-link">
//             <Button variant="ghost" className="text-slate-700">Login</Button>
//           </Link>
//           <Link to="/register" data-testid="register-nav-link">
//             <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">Get Started</Button>
//           </Link> */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link
//               to="/services"
//               className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
//             >
//               Services
//             </Link>

//             {user ? (
//               <div className="flex items-center space-x-4">
//                 <div className="text-right">
//                   <p className="text-sm font-semibold text-slate-900">
//                     {user.name}
//                   </p>
//                   <p className="text-xs text-slate-500">{user.email}</p>
//                 </div>

//                 <Link to="/profile">
//                   <Button variant="ghost">Profile</Button>
//                 </Link>
//               </div>
//             ) : (
//               <>
//                 <Link to="/login">
//                   <Button variant="ghost" className="text-slate-700">
//                     Login
//                   </Button>
//                 </Link>

//                 <Link to="/register">
//                   <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
//                     Get Started
//                   </Button>
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "@/utils/axios"; // ✅ use global axios

function Navbar({ transparent = false }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // ✅ Logout Handler
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null); // clear global auth
      navigate("/"); // redirect home
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b ${
        transparent ? "bg-white/80 backdrop-blur-xl" : "bg-white"
      } border-slate-200`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="text-xl font-bold text-slate-900">HomePros</span>
        </Link>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Services Link */}
          <Link
            to="/services"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Services
          </Link>

          {/* 🔥 AUTH SWITCH */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* User Info */}
              
              {/* <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div> */}

              {/* Profile */}
              <Link to="/profile">
                <Button variant="ghost">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                </Button>
              </Link>

              {/* Logout */}
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-slate-700">
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
