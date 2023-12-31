import { Button, Table, Modal } from "react-bootstrap"
import { useState, useEffect } from "react"
import PageTitle from "../components/PageTitle"

export default function Device() {
    let [text, setText] = useState([<p>Sử dụng kết nối Internet có dây để có chất lượng đường truyền tốt nhất.<br/>Chọn một mạng để kết nối bảng mạch với mạng đó:</p>])
    let [list, setList] = useState([])
    let [conList, setConList] = useState([])
    let [refresh, setRefresh] = useState(true)
    let [connectWifi, setConnectWifi] = useState(false)
    let [finConnectWifi, setFinConnectWifi] = useState(false)
    let [connectInfo, setConnectInfo] = useState({ssid: "", password: ""})

    useEffect(() => {
        if (refresh) {
            fetch("http://127.0.0.1:9000/api/scanwifi")
            .then(res => res.json())
            .then(data => { 
                data.sort((a ,b) => {
                    return parseFloat(b.quality) - parseFloat(a.quality)
                })
                setList(data)
            })
            setRefresh(false)
        }
    }, [refresh])

    useEffect(() => {
        if (refresh) {
            fetch("http://127.0.0.1:9000/api/checkwifi")
            .then(res => res.json())
            .then(data => { 
                data.sort((a ,b) => {
                    return parseFloat(b.quality) - parseFloat(a.quality)
                })
                setConList(data)
            })
            setRefresh(false)
        }
    }, [refresh])
    
    useEffect(() => {
        if (finConnectWifi) {
            fetch("http://127.0.0.1:9000/api/connectwifi", {
                method: "PUT",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(connectInfo)
             })
            .then(res => res.json())
            .then(data => { console.log(data); setText([<p>Đã kết nối với mạng {connectInfo.ssid} thành công</p>]) })
            setFinConnectWifi(false)
        }
    // eslint-disable-next-line
    }, [finConnectWifi])

    const openConnect = (ssid) => {
        setConnectInfo({ssid: ssid})
        setConnectWifi(true)
    }

    const makeTable = () => {
        let table = []
        list.forEach((data, i) => {
            if (data.ssid !== "" && data.ssid !== conList[0].bssid) {
                let cell = []
                cell.push(<td>{(i + 1).toString()}</td>)
                cell.push(<td>{data.ssid}</td>)
                cell.push(<td>{data.quality}%</td>)
                table.push(<tr style={{ cursor: "pointer" }} onClick={() => openConnect(data.ssid)}>{cell}</tr>)
            }
        })
        return table
    }

    const makeConTable = () => {
        let table = []
        conList.forEach((data, i) => {
            let cell = []
            cell.push(<td>{(i + 1).toString()}</td>)
            cell.push(<td>{data.bssid}</td>)
            cell.push(<td>{(data.quality <= 100) ? data.quality : 100}%</td>)
            table.push(<tr>{cell}</tr>)
    })
        return table
    }
    
    const connect = () => {
        setConnectWifi(false)
        setFinConnectWifi(true)
    }

    return (<>
        <PageTitle name="Kết nối wifi"></PageTitle>
        <div className="d-flex justify-content-start">{text}</div>
        <Button onClick={() => setRefresh(true)} className="border text-white bg-black mb-2 d-flex justify-content-end">Làm mới</Button>
        
        <Table bordered data-bs-theme="dark" className="text-center pe-2">
            <thead>
                <tr>
                    <td width={"10%"}><strong>STT</strong></td>
                    <td><strong>Tên mạng</strong></td>
                    <td><strong>Tín hiệu</strong></td>
                </tr>
            </thead>
            <tbody>
                <tr><td colSpan={3}><strong>Mạng đã kết nối</strong></td></tr>
                {makeConTable()}
                <tr><td colSpan={3}><strong>Mạng chưa kết nối</strong></td></tr>
                {makeTable()}
            </tbody>
        </Table>
        
        <Modal id="edit-name" show={connectWifi} onHide={() => setConnectWifi(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Kết nối mạng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h4>Tên mạng: {connectInfo.ssid}</h4>
            <input style={{ boxSizing: "border-box", width: "100%"}} autoFocus={true} type="text" className="bg-dark" placeholder="Mật khẩu" onChange={(e) => setConnectInfo({...connectInfo, password: e.target.value})} onKeyDown={(e) => {
                if (e.key === "Enter")
                    connect()
                }}
            ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setConnectWifi(false)}>
            Huỷ bỏ
          </Button>
          <Button variant="success" onClick={connect}>
            Kết nối
          </Button>
        </Modal.Footer>
      </Modal>
    </>)
}