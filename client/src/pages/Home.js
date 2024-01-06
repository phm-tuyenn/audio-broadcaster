import PageTitle from "../components/PageTitle"
import { Card, Row, Col, Container, Form } from "react-bootstrap"
import "./css/home.css"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Home() {
    let [devZone, setDevZone] = useState(false)
    let [internet, setInternet] = useState()
    //let [interface, setInterface] = useState()

    const useGetInternet = () => {
        useEffect(() => {
            fetch("http://127.0.0.1:9000/api/internet")
            .then(res => res.json())
            .then(data => {setInternet(data.available); /*setInterface(data.interface)*/})
            .catch(err => console.log(err))
        }, [])
    }

    useGetInternet()

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
                            <Card.Title className="text-center">Chuyển sang kết nối Wifi</Card.Title>
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
                defaultChecked={devZone}
                onClick={() => {setDevZone(!devZone)}}
            />
            {devZone ? <>
                develop zone cputemp cpu ram usage
            </> : <>
                {internet ? <p>Đã kết nối Internet.</p>: <p>Chưa kết nối Internet. Hãy chuyển sang <Link to="/device"><a>cài đặt kết nối Wifi</a></Link> hoặc cắm cáp Internet.</p> }
                {/*check eth or wlan*/}
            </>
            }
            
        </Container>
    </>)
}