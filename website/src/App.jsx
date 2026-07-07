import React from "react";
import HeaderMain from "./Components/Header/HeaderMain";
import FooterMain from "./Components/Footer/FooterMain";
import Routes from "./Routes";

import { useRoutes } from "react-router-dom";

export default function App() {
  const router = useRoutes(Routes);
  return <></>;
}
