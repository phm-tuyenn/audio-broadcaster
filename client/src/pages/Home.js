import PageTitle from "../components/PageTitle"
import { Card, Row, Col, Container, ProgressBar } from "react-bootstrap"
import "./css/home.css"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Home() {
    let [queue, setQueue] = useState([])
    let [txt, setTxt] = useState()
    let [internet, setInternet] = useState()
    let [cpu, setCpu] = useState(0)
    let [ram, setRam] = useState({total: 0, percent: 0, used: 0})
    let [disk, setDisk] = useState({total: 0, percent: 0, used: 0, free: 0})
    let [cpuTemp, setCpuTemp] = useState({temp: 0})
    let [interFace, setInterface] = useState({interface: ""})
    const [temp, setTemp] = useState(0)
    //let [interface, setInterface] = useState()
    useEffect(()=>{
        setInterval(()=>{
          setTemp((prevTemp)=>prevTemp+0.00001)
        }, 500)
    }, [])

    useEffect(() => {
        fetch("/api/read")
        .then(res => res.json())
        .then(data => {
            data.forEach(a => a.tm.sort((a, b) => { return a.time - b.time }))
            data.sort((a, b) => {
                return b.tm[0].time - a.tm[0].time
            })
            setQueue(data);
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        fetch("/api/internet")
        .then(res => res.json())
        .then(data => {setInternet(data.available); /*setInterface(data.interface)*/})
        .catch(err => console.log(err))
    }, [temp])

    useEffect(() => {
        fetch("/api/cpu")
        .then(res => res.json())
        .then(data => {setCpu(data.value);})
        .catch(err => console.log(err))
    }, [temp])

    useEffect(() => {
        fetch("/api/ram")
        .then(res => res.json())
        .then(data => {setRam(data);})
        .catch(err => console.log(err))
    }, [temp])

    useEffect(() => {
        fetch("/api/disk")
        .then(res => res.json())
        .then(data => {setDisk(data);})
        .catch(err => console.log(err))
    }, [temp])

    useEffect(() => {
        fetch("/api/cpu/temp")
        .then(res => res.json())
        .then(data => {setCpuTemp(data);})
        .catch(err => console.log(err))
    }, [temp])

    useEffect(() => {
        fetch("/api/interface")
        .then(res => res.json())
        .then(data => {setInterface(data);})
        .catch(err => console.log(err))
    }, [temp])

    function timeStringToFloat(time) {
        var hoursMinutes = time.split(/[.:]/);
        var hours = parseInt(hoursMinutes[0], 10);
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes / 60;
    }

    function minTommss(minutes){
        let sign = minutes < 0 ? "-" : "";
        let min = Math.floor(Math.abs(minutes))
        let sec = Math.floor((Math.abs(minutes) * 60) % 60);
        return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
    }
    useEffect(() => {
        let d = new Date()
        let datetext = d.toTimeString();
        datetext = datetext.split(' ')[0]
        datetext = datetext.substring(0, datetext.length - 3)
        let time = timeStringToFloat(datetext)
        let l = false
        queue.some(a => {
            a.tm.some(x => {
                if (x.time > time && x.day.includes(d.getDay())) {
                    setTxt(`${a.name} - Thời gian: ${minTommss(x.time)} - Nội dung: ${(a.type === "text") ? a.id : (a.type === "link") ? "từ danh sách phát" : "từ USB"}`)
                    l = true
                }
                return l
            })
            if (!l) setTxt(`${queue[0].name} - Thời gian: ${minTommss(queue[0].tm[0].time)} - Nội dung: ${(queue[0].type === "text") ? queue[0].id : (queue[0].type === "link") ? "từ danh sách phát" : "từ USB"}`)
            return l
        })
    }, [queue])

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
            <div className="mb-1">Bảng mạch {internet ? <>đã kết nối Internet qua {interFace.interface}.</>: <>chưa kết nối Internet. Hãy chuyển sang <Link to="/device">cài đặt kết nối Wifi</Link> hoặc cắm cáp Internet.</> }</div>
            <div>Lịch phát tiếp theo: {txt}</div>
            <label className="mb-1"> CPU: {cpuTemp.temp}°C</label>
            <ProgressBar className="mb-1">
                <ProgressBar now={cpu} label={`Đã sử dụng ${cpu}%`} variant={(cpu < 90) ? "success" : "danger"}></ProgressBar>
                <ProgressBar now={100 - cpu} label={`Còn lại ${100 - cpu}%`} variant="secondary"></ProgressBar>
            </ProgressBar>
            <label className="mb-1"> RAM: Tổng: {ram.total} GB </label>
            <ProgressBar className="mb-1">
                <ProgressBar now={ram.percent} label={`Đã sử dụng ${ram.value} GB`} variant={(ram.percent < 90) ? "success" : "danger"}></ProgressBar>
                <ProgressBar now={100 - ram.percent} label={`Còn lại ${Math.round((ram.total - ram.value) * 100) / 100} GB`} variant="secondary"></ProgressBar>
                </ProgressBar>
            <label className="mb-1">Ổ cứng: Tổng: {disk.total} GB</label>
            <ProgressBar className="mb-1">
                    <ProgressBar now={disk.percent} label={`Đã sử dụng ${disk.used} GB`} variant={(disk.percent < 90) ? "success" : "danger"}></ProgressBar>
                    <ProgressBar now={100 - disk.percent} label={`Còn lại ${disk.free} GB`} variant="secondary"></ProgressBar>
            </ProgressBar>
            {/*check eth or wlan*/}
        </Container>
    </>)
}