import { Button, Container, Table, Modal } from "react-bootstrap"
import PageTitle from "../components/PageTitle"
import "./css/schedule.css"
import { useState, useEffect } from "react"

export default function Schedule() {
    let [content, setContent] = useState([<p key="text">Nhấn vào một lịch phát ở bảng bên trái để chỉnh sửa thông tin lịch phát đó</p>])
    let [config, sConfig] = useState([])
    let [selected, setSelected] = useState(-1)
    let [tempName, setTempName] = useState("")
    let bkConfig = config

    let [editName, setEditName] = useState(false);

    const setConfig = (data) => {
        sConfig(data)
        bkConfig = data
    }
    const useGet = (type) => {
        useEffect(() => {
            fetch("http://127.0.0.1:9000/api/read", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({ file: `${type}` })
            })
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch (err => console.error(err))
        }, [])
    }
    useGet("config")

    const add = (type) => {
        switch (type) {
            case "config":
                setConfig([...config, {
                    "name": "Lịch phát " + (config.length + 1).toString(),
                    "context": [1],
                    "tm": [0]
                  }])
                break;
            default:
                break;
        }
    }
    
    const useUpdate = (type, data) => {
        useEffect(() => {
            fetch("http://127.0.0.1:9000/api/update", {
                method: "PUT",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({ file: `${type}`, data: data })
            })
            .then(res => res.json())
            .then(dta => console.log(dta))
            .catch (err => console.error(err))
        }, [])
    }

    const modify = (i) => {
        setSelected(i)
        let a = config[i]
        setContent((cnt) => {
            cnt = []
            cnt.push(<div key="title" className="mb-1 d-flex justify-content-center">
                <h2 className="d-inline-block me-2">{a.name}</h2>
                <Button className="button" onClick={() => setEditName(true)}>Đổi tên</Button>
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
                <Button className="border mt-5 me-1" variant="success" onClick={() => useUpdate("config", {adu:"ok"})}>Lưu lịch phát này</Button>
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

    const handleChangeName = () => {
        config[selected].name = tempName
        setEditName(false)
        modify(selected)
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
                    <tr className="cell" onClick={() => add("config")}>
                        <td colSpan={2}><strong>Thêm lịch phát</strong></td>
                    </tr>
                </tbody>
            </Table>
        </Container>

        <Container id="modPanel" className="border-start">
            {content}
        </Container>

        <Modal id="edit-name" show={editName} onHide={() => setEditName(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đổi tên lịch phát</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Tên cũ: {(selected === -1) ? "" : config[selected].name}<br/>
            Tên mới: 
            <input autoFocus={true} type="text" className="bg-dark" placeholder="Nhập tên mới..." onChange={(e) => setTempName(e.target.value)} onKeyDown={(e) => {
                if (e.key === "Enter")
                    handleChangeName()
                }}
            ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setEditName(false)}>
            Huỷ bỏ
          </Button>
          <Button variant="success" onClick={handleChangeName}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>)
}