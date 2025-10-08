import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import ScrollToTop from "./utils/ScrollToTop";
import Layout from "./layout/Layout";


function App() {
  return (
    <div className="bg-cream">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={
            <Layout>
              <Outlet />
            </Layout>} >
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
