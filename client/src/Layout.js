import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom"
import Navigation from "./components/Navigation"
import { useState } from "react";
import "./layout.css"

export default function Layout() {
  let [ time, setTime ] = useState(new Date().toLocaleString("vi-VN"))
  setInterval(() => {
    setTime(new Date().toLocaleString("vi-VN"))
  }, 1000)
  return (
    <div className="page-container">
        <Navigation className="head"/>

        <Container fluid className="out my-4">
          <Outlet/>
        </Container>

        <Container fluid style={{ display: "flex", justifyContent:"space-between", fontSize: "10px" }}>
          <p>From <a href="https://github.com/phm-tuyenn" target="_blank" rel="noreferrer">@phm-tuyenn</a> with ❤️</p>
          <p>Copyright © 2024 All rights reserved.</p>
          <p>{time}</p>
        </Container>
    </div>
  );
}
