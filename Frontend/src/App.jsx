import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import ForgotPassword from "./modules/common/ForgotPassword";
import PropertyDetail from "./modules/common/PropertyDetail";
import NotFound from "./modules/common/NotFound";
import AdminHome from "./modules/admin/AdminHome";
import OwnerHome from "./modules/user/owner/OwnerHome";
import RenterHome from "./modules/user/renter/RenterHome";
import AllUsers from "./modules/admin/AllUsers";
import AddProperty from "./modules/user/owner/AddProperty";
import AdminAllBookings from "./modules/admin/AllBookings";
import AdminAllProperty from "./modules/admin/AllProperty";
import AllPropertiesCards from "./modules/user/AllPropertiesCards";

export const UserContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setUserLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, userLoggedIn, setUserLoggedIn }}>
      <BrowserRouter>
        <Routes>
          {/* Common Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/property/:id' element={<PropertyDetail />} />

          {/* Dashboard Routes */}
          <Route path='/adminhome' element={<AdminHome />} />
          <Route path='/ownerhome' element={<OwnerHome />} />
          <Route path='/renterhome' element={<RenterHome />} />

          {/* Sub-routes */}
          <Route path='/getallbookings' element={<AdminAllBookings />} />
          <Route path='/getallproperties' element={<AdminAllProperty />} />
          <Route path='/getallusers' element={<AllUsers />} />
          <Route path='/postproperty' element={<AddProperty />} />
          <Route path='/getAllProperties' element={<AllPropertiesCards />} />

          {/* 404 Fallback Route */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;