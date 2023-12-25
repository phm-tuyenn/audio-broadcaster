import { Button, Container, Table } from "react-bootstrap"
import PageTitle from "../components/PageTitle"
import "./css/schedule.css"
import { useState } from "react"
let config = require("../config.json")

export default function Schedule() {
    let [content, setContent] = useState([<p key="text">Nhấn vào một lịch phát ở bảng bên trái để chỉnh sửa thông tin lịch phát đó</p>])
    const add = () => {

    }

    const modifyAPI = () => {
        fetch("http://localhost:9000/api")
        .then(res => {console.log(res)})
        .catch(err => {console.error(err)})
        .then(response => console.log('Success:', response))
        .catch(error => console.error('Error:', error))
    }

    const modify = (i) => {
        let a = config[i]
        setContent((cnt) => {
            cnt = []
            cnt.push(<div key="title" class="mb-1 d-flex justify-content-center">
                <h2 className="d-inline-block me-2">{a.name}</h2>
                <Button className="button">Đổi tên</Button>
            </div>)
            cnt.push(<div key="context" className="mb-1">
                <strong>{"Lời nhắc: "}</strong>
                <Button className="button">Chỉnh sửa</Button>
            </div>)
            cnt.push(<div key="time" className="mb-1">
                <strong>{"Thời gian phát: "}</strong>
                <Button className="button">Chỉnh sửa</Button>
            </div>)
            cnt.push(<div key="save-cancel-delete">
                <Button className="border mt-5 me-1" variant="success">Lưu lịch phát này</Button>
                <Button className="border mt-5 me-1" variant="dark">Huỷ bỏ thay đổi</Button>
                <Button className="border mt-5" variant="danger">Xoá lịch phát này</Button>
            </div>)
            return cnt 
        })
    }

    const setTable = () => {
        let list = []
        config.forEach((data, i) => {
            let cell = []
            cell.push(<td key={i.toString() + "-slot"}>
                {(i + 1).toString()}
            </td>)
            cell.push(<td key={i.toString() + "-name"}>
                {data.name}
            </td>)
            list.push(<tr key={i.toString()} className="cell" onClick={() => modify(i)}>
                {cell}
            </tr>)
        })
        return (list)
    }
    return (<>
        <PageTitle name="Cài đặt lịch phát"></PageTitle> 
        <Container id="table">
            <Table bordered data-bs-theme="dark" className="text-center pe-2">
                <thead>
                    <tr>
                        <td width={"10%"}><strong>STT</strong></td>
                        <td><strong>Lịch phát</strong></td>
                    </tr>
                </thead>
                <tbody>
                    {setTable()}
                    <tr className="cell" onClick={add()}>
                        <td colSpan={2}><strong>Thêm lịch phát</strong></td>
                    </tr>
                </tbody>
            </Table>
        </Container>
        <Container id="modPanel" className="border-start">
            {content}
        </Container>
    </>)
}