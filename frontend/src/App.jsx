import React from "react";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthForm from "./pages/AuthForm/AuthForm";

const routes = (
  <Router>
    <Routes>
      <Route path="/sign-up" element={<AuthForm type="sign-up" />} />
      <Route path="/sign-in" element={<AuthForm type="sign-in" />} />
      <Route path="/" element={<AuthForm type="sign-in" />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
);
const App = () => {
  return <div>{routes}</div>;
};

export default App;
