import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import About from './pages/About';
import AddEdit from './pages/AddEdit';
import Home from './pages/Home';
import View from './pages/View';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import Search from "./pages/Search";

// 로그인 세팅
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";

//teststock
import Teststock from './pages/Teststock'

function App() {
  const {currentUser} = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <div className="App">
        {currentUser ? <Header /> : null}
        <ToastContainer position="top-center" />
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/add" element={<AddEdit/>} />
          <Route path="/update/:id" element={<AddEdit/>} />
          <Route path="/view/:id" element={<View/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/search" element={<Search/>} />

          {/* login */}
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />

          {/* testStock */}
          <Route path="/stock" element={<Teststock/>} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;