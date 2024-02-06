import React  from "react";
import { Routes, Route } from "react-router-dom";
import { HeroSection } from "./components/major-components/HeroSection";
//--------------Noty CSS----------------------
import "./assets/sass/app.scss";
import "./components/fontawesomeIcons"

export function App() {


  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
    </Routes>
  );

}
