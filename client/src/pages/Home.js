import PageTitle from "../components/PageTitle"
import { Card, Row, Col, Container, Form } from "react-bootstrap"
import "./css/home.css"
import { Link } from "react-router-dom"
import { useState } from "react"

export default function Home() {
    let [devZone, setDevZone] = useState(false)
    return (<>
        <PageTitle name="Trang chủ"></PageTitle>
        <Row sm={1} md={2} lg={3} xxl={4} style={{ display: "flex", justifyContent:"center" }}>
            <Col style={{ justifyContent:"center" }}>
                <Link to="/schedule">
                    <Card id="button">
                        <Card.Body>
                            <Card.Title className="text-center">Chuyển sang cài đặt lịch phát</Card.Title>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
            <Col style={{ justifyContent:"center" }}>
                <Link to="/device">
                    <Card id="button">
                        <Card.Body>
                            <Card.Title className="text-center">Chuyển sang cài đặt thiết bị</Card.Title>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
        </Row>
        <Container fluid className="mt-4 border-top">
            <Form.Check
                type="switch"
                id="custom-switch"
                label="Kích hoạt khu vực dành cho nhà phát triển"
                checked={devZone}
                onClick={() => {setDevZone(!devZone)}}
            />
            <div style={{ visibility: (devZone) ? "visible" : "hidden" }}>
                developer zone
                contain cpu, ram usage, cpu temp, terminal output
            </div>
            
        </Container>
    </>)
}