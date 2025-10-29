import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import Home from "./features/Home/Home";
import ScrollToTop from "./utils/ScrollToTop";
import Layout from "./layout/Layout";
import Register from "./features/Auth/Register";
import Login from "./features/Auth/Login";


function App() {
  return (
    <div className="bg-cream w-full h-screen">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={
            <Layout>
              <Outlet />
            </Layout>} >
            <Route index element={<Home />} />
          </Route>
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
