import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookProvider from './provider/BookProvider';
import Home from './components/Home';
import Books from './components/Books';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import AdminViewBook from './components/AdminViewBook';
import EditBook from './components/EditBook';
import AdminSignin from './components/AdminSignin';
import AdminPrivateRoutes from './components/AdminPrivateRoutes';
import Page404 from './components/Page404';
import UserSignin from './components/UserSignin';
import AddBook from './components/AddBook';
import UserPrivateRoutes from './components/UserPrivateRoutes';
import UserAccount from './components/UserAccount';
import UserSignup from './components/UserSignup';
import EditUserAccount from './components/EditUserAccount';
import AdminAccount from './components/AdminAccount';
import Cart from './components/Cart';
import ViewBook from './components/ViewBook';
import Checkout from './components/Checkout';
import AdminOrders from './components/AdminOrders';
import AdminOrder from './components/AdminOrder';
import BooksByX from './components/BooksByX';
import Orders from './components/Orders';
import Order from './components/Order';


function App() {
  return (
    <BookProvider>
      <Router>
        <ToastContainer />
        <Header />
        <div className="container py-5" id="content">
          <Routes>
            <Route path='*' element={<Page404 />} />
            <Route exact path="/admin/signin" element={<AdminSignin />} />
            <Route exact path="/signin" element={<UserSignin />} />
            <Route exact path="/signup" element={<UserSignup />} />
            <Route exact path="/" element={<Home />} />
            <Route exact path="/books/:param1/:param2" element={<BooksByX />} />
            <Route exact path="/cart" element={<Cart/>} />
            <Route exact path="/book/view/:id" element={<ViewBook/>} />
            <Route element={<UserPrivateRoutes />}>
              <Route exact path="/checkout" element={<Checkout/>} />
              <Route exact path="/orders" element={<Orders/>} />
              <Route exact path="/order/:id" element={<Order/>} />
              <Route exact path="/user/account" element={<UserAccount />} />
              <Route exact path="/user/account/edit" element={<EditUserAccount />} />
            </Route>
            <Route element={<AdminPrivateRoutes />}>
              <Route exact path="/admin/order/:id" element={<AdminOrder />} />
              <Route exact path="/admin/orders" element={<AdminOrders />} />
              <Route exact path="/admin/account" element={<AdminAccount />} />
              <Route exact path="/admin/book/add" element={<AddBook />} />
              <Route exact path="/admin/books" element={<Books />} />
              <Route exact path="/admin/book/view/:id" element={<AdminViewBook />} />
              <Route exact path="/admin/book/edit/:id" element={<EditBook />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </Router>
    </BookProvider>
  );
}

export default App;
