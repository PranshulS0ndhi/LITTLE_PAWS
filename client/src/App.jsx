
import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'; 
import AdminLayout from './components/admin-view/layout';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminProducts from './pages/admin-view/products';
import AdminOrders from './pages/admin-view/orders';
import ShoppingLayout from './components/shopping-view/layout';
import NotFound from './pages/not-found';
import ShoppingHome from './pages/shopping-view/home';
import ShoppingListing from './pages/shopping-view/listing';
import ShoppingCheckout from './pages/shopping-view/checkout';
import ShoppingAccount from './pages/shopping-view/account';
import CheckAuth from './components/common/check-auth';
import UnauthPage from './pages/unauth-page';
import Landingpage from './pages/main-home-page/landing-page';
import MainSearchPage from './pages/main-search-page/main-search-page';
import PetPage from './pages/main-pet-page/Main-pet-page';
import MainAdoptionForm from './pages/main-adoption-form/MainAdoptionForm';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/auth-slice';
import { useEffect } from 'react';
import { Skeleton } from './components/ui/skeleton';
import ApplicationStatus from './pages/main-application-status/ApplicationStatus';
import AdoptionRequests from './pages/main-adoption-requests/AdoptionRequests';
import MainAdminPanel from './pages/main-shelter-admin/mainShelterAdmin';
import AboutUs from './pages/main-about-us/MainAboutUs';
import MainReportStray from './pages/main-report-stray/mainReportStray';
import ShelterAdminRegister from './pages/auth/shelter-admin-register';

function App() {

  const {user,isAuthenticated,isLoading}=useSelector(state=>state.auth)
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  return (
    <>
    <div className="flex flex-col overflow-hidden bg-white">
    <Routes>
      <Route path='/' element={<Landingpage/>}/>
      <Route path='/search' element={<MainSearchPage/>}/>
      <Route path='/pet/:petId' element={<PetPage/>}/>
      <Route path='/aboutUs' element ={<AboutUs/>}/>
      <Route path='/form/:petId' element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <MainAdoptionForm/>
          </CheckAuth>}/>
      <Route path='/applicationStatus' element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdoptionRequests/>
          </CheckAuth>}/>
      <Route path='/my-applications' element={<Navigate to="/applicationStatus" replace />} />
      <Route path='/applicationStatus/:id' element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ApplicationStatus/>
          </CheckAuth>}/>
      
  
        
      <Route path='/reportStray' element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <MainReportStray/>
          </CheckAuth>}/>
      
      <Route path="/shelterAdmin" element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <MainAdminPanel/>
        </CheckAuth>
      }></Route>
    </Routes>
    
      <Routes>
      <Route
          path="/shop"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout/>
          </CheckAuth>
        }>
        <Route path="login" element={<AuthLogin/>}/>
        <Route path="register" element={<AuthRegister/>}/>
        <Route path="register-shelter-admin" element={<ShelterAdminRegister/>}/>
        </Route>
        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout/>
          </CheckAuth>
        }>
        <Route path='dashboard' element={<AdminDashboard/>}/>
        <Route path='products' element={<AdminProducts/>}/>
        <Route path='orders' element={<AdminOrders/>}/>
        </Route>

        <Route path='/shop' element={
          <ShoppingLayout/> 
        }>
        <Route path='home' element={
          <ShoppingHome/>
        }/>
        <Route path='listing' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <ShoppingListing/>
          </CheckAuth>
          }/>
        <Route path='checkout' element={<ShoppingCheckout/>}/>
        <Route path='account' element={<ShoppingAccount/>}/>
        </Route>
        <Route path="/unauth-page" element={<UnauthPage/>}/>
        {/* <Route path="*" element={<NotFound/>}/> */}
      </Routes>
    </div>
    </>
  )
}

export default App
