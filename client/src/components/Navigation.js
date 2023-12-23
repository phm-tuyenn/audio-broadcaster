import { Button, Container, Nav, Navbar, Offcanvas, Stack } from "react-bootstrap";
import { Link } from "react-router-dom"
import { useState } from "react";
import "./css/navbar.css"

export default function Navigation() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Navbar className="rounded-bottom dark" data-bs-theme="dark" bg="dark">
      <Container fluid className="px-3">
        <Navbar.Brand className="ms-4">
          Bảng điều khiển
        </Navbar.Brand>
        <Nav className="float-end">
          <Nav.Item className="mx-4 d-none d-sm-block">
            <Link to="/"><Button className="nav-button">Trang chủ</Button></Link>
          </Nav.Item>
          <Nav.Item className="mx-4 d-none d-sm-block">
            <Link to="/schedule"><Button className="nav-button">Cài đặt lịch phát</Button></Link>
          </Nav.Item>
          <Nav.Item className="mx-4 d-none d-sm-block">
            <Link to="/device"><Button className="nav-button">Cài đặt thiết bị</Button></Link>
          </Nav.Item>
          <Nav.Item className="mx-4 d-sm-none">
            <Button as="a" className="nav-button" onClick={handleShow}>
              &#9776;
            </Button>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
    
    <Offcanvas show={show} onHide={handleClose} data-bs-theme="dark" className="dark">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Bảng điều khiển</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          <Link onClick={handleClose} to="/"><Button className="nav-button">Trang chủ</Button></Link>
          <Link onClick={handleClose} to="/schedule"><Button className="nav-button">Cài đặt lịch phát</Button></Link>
          <Link onClick={handleClose} to="/device"><Button className="nav-button">Cài đặt thiết bị</Button></Link>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  </>
  )
}