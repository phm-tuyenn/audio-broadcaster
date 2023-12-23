import PageTitle from "../components/PageTitle"
import { Card, Row, Col, Container } from "react-bootstrap"
import "./css/home.css"
import { Link } from "react-router-dom"

export default function Home() {
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
            developer zone
        </Container>
    </>)
}