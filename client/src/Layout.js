import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom"
import { useState } from "react";
import "./layout.css"

export default function Layout() {
  let [ time, setTime ] = useState(new Date().toLocaleString("vi-VN"))
  setInterval(() => {
    setTime(new Date().toLocaleString("vi-VN"))
  }, 1000)
  return (
    <div className="page-container">

        <Container fluid className="out my-4">
          <Outlet/>
        </Container>

        <Container fluid style={{ display: "flex", justifyContent:"center", fontSize: "10px" }}>
          <p>Copyright © {(new Date()).getFullYear()} All rights reserved.</p>
        </Container>
    </div>
  );
}
