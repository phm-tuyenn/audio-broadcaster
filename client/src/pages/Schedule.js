import { Button, Container, Table } from "react-bootstrap"
import PageTitle from "../components/PageTitle"
import "./css/schedule.css"
import { useState, useEffect, useRef } from "react"

function removeIndex(arr, index) {
    const half1 = arr.slice(0, index)
    const half2 = arr.slice(index + 1);
    return half1.concat(half2);
}

function minTommss(minutes){
    let sign = minutes < 0 ? "-" : "";
    let min = Math.floor(Math.abs(minutes))
    let sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}

function mmssToMin(time) {
    let hoursMinutes = time.split(/[.:]/);
    let hours = parseInt(hoursMinutes[0], 10);
    let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }

export default function Schedule() {
    let [content, setContent] = useState([<p key="text">Chọn đúng USB ở bên trái và nhấn vào một lịch phát ở bảng bên trái để chỉnh sửa thông tin lịch phát đó. Chỉnh sửa xong, nhấn Hoàn tất chỉnh sửa ở bên trái để lưu lại. Quá trình lưu cần Internet và có thể mất từ vài phút tuỳ thuộc tốc độ mạng của bạn.</p>])
    let [data, sData] = useState([])
    let [selected, setSelected] = useState(-1)
    let [update, setUpdate] = useState(false)
    let [status, setStatus] = useState("")
    let [path, setPath] = useState({})
    let [paths, setPaths] = useState([])
    let [pathInput, setPathInput] = useState([])

    const inputName = useRef(null);
    const inputContent = useRef(null);

    let editData = data

    useEffect(() => {
        setStatus((selected !== -1) ? `Đang chọn lịch phát số ${selected + 1}` : "")
    }, [selected])

    
    const setData = (data) => { 
        sData(data)
        console.log("rerender")
    }

    useEffect(() => {
        fetch("http://127.0.0.1:9000/api/usb")
        .then(res => res.json())
        .then(dta => { 
            setPaths(dta); 
            if(dta.length !== 0 && path === "") setPath(dta[0])
        })
        .catch (err => console.error(err))
    }, [])

    useEffect(() => {
        fetch("http://127.0.0.1:9000/api/read", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({path: path.deviceid})
        })
        .then(res => res.json())
        .then(dta => { setData(dta) })
        .catch (err => console.error(err))
    }, [path])

    const add = (type, i = 0) => {
        switch (type) {
            case "config":
                console.log("Add config")
                editData.push({
                    "name": "Lịch phát " + (data.length + 1).toString(),
                    "type": "text",
                    "rand": false,
                    "id": "",
                    "tm": [],
                    "dir": data.length + 1
                })
                setData(editData);
                break;
            case "time":
                console.log("Add time")
                editData[i].tm.push({"time":0,"day":[]})
                setData(editData);
                break;
            default:
                break;
        }
        setUpdate(true)
        modify(i)
    }

    const del = (index) => {
        editData = removeIndex(editData, index)
        setSelected(-1)
        setContent([<p key="text">Chọn đúng USB ở bên trái và nhấn vào một lịch phát ở bảng bên trái để chỉnh sửa thông tin lịch phát đó. Chỉnh sửa xong, nhấn Hoàn tất chỉnh sửa ở bên trái để lưu lại. Quá trình lưu cần Internet và có thể mất từ vài phút tuỳ thuộc tốc độ mạng của bạn.</p>])
        setData(editData);
        setUpdate(true)
    }
    
    useEffect(() => {
        if (update) {
            console.log(`update`)
            fetch("http://127.0.0.1:9000/api/update", {
                method: "PUT",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({path: path.deviceid, data: data})
            })
            .then(res => res.json())
            .then(dta => { 
                setUpdate(false); 
                setStatus("Chỉnh sửa thành công"); 
            })
            .catch (err => {console.error(err); setUpdate(false); setStatus("Có lỗi xảy ra. Vui lòng tải lại trang")})
        }
    // eslint-disable-next-line
    }, [update])

    const openExplorer = (i) => {
        fetch("http://127.0.0.1:9000/api/explorer", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({path: path.deviceid, id: data[i].dir})
        })
        .then(res => res.json())
        .then(dta => { console.log(dta) })
        .catch (err => console.error(err))
    }

    const modify = (i) => {
        console.log("modify", i)
        setSelected(i)
        let a = data[i]
        setContent((cnt) => {
            cnt = []
            cnt.push(<h4 key="title" className="d-flex align-center justify-content-center mb-1">
                <label htmlFor="edit-name">Tên lịch phát: </label>
                <textarea
                    id="edit-name"
                    rows={`1`}
                    className="me-3 ms-2 bg-black rounded" 
                    value={a.name} 
                    placeholder="Nhập tên mới..."
                    ref={inputName}
                    onChange={(e) => { 
                        editData[i].name = e.target.value; 
                        setData(editData) 
                        setUpdate(true)
                        modify(i)
                    }} 
                    onKeyDown={(e) => {
                        if (e.key === "Enter")
                            inputName.current.blur()
                        }}></textarea>
            </h4>)
            cnt.push(<h6 className="d-flex align-center justify-content-start mb-2">Loại lịch phát: {(a.type === "text") ? "Lời nhắc (hãy thêm một dấu cách vào cuối câu để tăng độ chính xác cho chương trình)" : (a.type === "link") ? "Nhạc (hãy đặt tên file bằng kí tự không dấu)" : ""}</h6>)
            if(a.type === "text") {
                cnt.push(<h6 key="content" className="d-flex align-center justify-content-start mb-2">
                    <label for="edit-content">Lời nhắc: </label>
                    <textarea
                        id="edit-content"
                        rows={`1`}
                        cols={`50`}
                        className="d-inline-block me-3 ms-2 bg-black rounded" 
                        value={a.id} 
                        placeholder="Nhập lời nhắc hoặc liên kết danh sách phát..."
                        ref={inputContent}
                        onChange={(e) => {
                            editData[i].id = e.target.value
                            editData[i].type = "text"
                            setData(editData) 
                            setUpdate(true)
                            modify(i)
                            console.log(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter")
                                inputContent.current.blur()
                            }}></textarea>
                </h6>)
            } else {
                cnt.push(<h6 key="content" className="d-flex align-center justify-content-start mb-2">
                    <label for="edit-content">Lời nhắc: </label> 
                    <Button className="border-white bg-black ms-1" onClick={() => openExplorer(i)}>Mở thư mục nhạc</Button>
                </h6>)
            }
            if (a.type !== "text") cnt.push(<h6 className="d-flex align-center justify-content-start mb-2">
                <label htmlFor="rand" className="me-1">Phát ngẫu nhiên</label> 
                <input type="checkbox" checked={a.rand} onChange={(e) => { 
                    editData[i].rand = e.target.checked
                    setData(editData)
                    setUpdate(true)
                    modify(i)
                }}></input>
            </h6>)
            cnt.push(<div key="time">
                <h6>Thời gian: </h6>
                <Table bordered data-bs-theme="dark" className="text-center pe-2">
                    <thead>
                        <tr>
                            <td><strong>Giờ phát</strong></td>
                            <td><strong>Ngày phát</strong></td>
                            <td><strong>Xoá</strong></td>
                        </tr>
                    </thead>
                    <tbody>
                        {makeTimeTable(i)}
                        <tr className="cell" onClick={() => add("time", i)}>
                            <td colSpan={3}><Button className="border-white bg-black">Thêm thời gian phát</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </div>)
            cnt.push(<Button key="del" className="border mt-5" variant="danger" onClick={() => del(i)}>Xoá lịch phát này</Button>)
            return cnt 
        })
    }

    const makeTable = () => {
        console.log("table")
        let list = []
        data.forEach((dta, i) => {
            let cell = []
            cell.push(<td key={i.toString() + "-slot"}>
                {(i + 1).toString()}
            </td>)
            cell.push(<td key={i.toString() + "-name"}>
                {dta.name}
            </td>)
            list.push(<tr key={i.toString()} className={`cell`} onClick={() => {modify(i)}}>
                {cell}
            </tr>)
        })
        return list
    }

    const showDay = (k, i) => {
        let list = []
        for (let temp = 2; temp <= 8; temp++) {
            list.push(<Button className={`me-1 mb-1 border-white bg-${(data[k].tm[i].day.includes(temp - 2)) ? "success" : "black"}`}
            onClick={() => {
                if (data[k].tm[i].day.includes(temp - 2)) {
                    editData[k].tm[i].day = removeIndex(editData[k].tm[i].day, editData[k].tm[i].day.findIndex((a) => {return editData[k].tm[i].day.includes(a)}))
                } else editData[k].tm[i].day.push(temp - 2)
                setData(editData)
                setUpdate(true)
                modify(k)
            }}>
                {(temp !== 8) ? `Thứ ${temp}` : "Chủ nhật"}
            </Button>)
        }
        return list
    }

    const makeTimeTable = (k) => {
        console.log("time table")
        let list = []
        data[k].tm.forEach((dta, i) => {
            let cell = []
            cell.push(<td key={i.toString() + "-time"}>
                <input type="time" value={minTommss(dta.time)} onChange={(e) => {
                    editData[k].tm[i].time = mmssToMin(e.target.value)
                    setData(editData)
                    setUpdate(true)
                    modify(k)
                }}></input>
            </td>)
            cell.push(<td key={i.toString() + "-day"}>
                {showDay(k, i)}
            </td>)
            cell.push(<td key={i.toString() + "-del"}>
                <Button key="del" className="border" variant="danger" onClick={() => {
                    editData[k].tm = removeIndex(editData[k].tm, i)
                    setData(editData)
                    setUpdate(true)
                    modify(k)
                }}>&#10006;</Button>
            </td>)
            list.push(<tr key={i.toString()} className={`cell`}>
                {cell}
            </tr>)
        })
        return list
    }

    useEffect(() => {
        let content = []
        paths.forEach((pth, i) => {
            content.push(<option value={i}>{pth.deviceid} {pth.volumename}</option>)
        })
        setPathInput(content)
    }, [paths])

    return (<>
        <PageTitle name="Cài đặt lịch phát"></PageTitle> 
    
        <Container id="table">
        <Container fluid className="border-bottom p-2">
            <Button className="d-flex justify-content-end border-white bg-success mb-3" onClick={() => {
                if(window.confirm("Bạn chắc chắn là đã hoàn tất chỉnh sửa rồi chứ?")) {
                    fetch("http://127.0.0.1:9000/api/generate", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        },
                        body: JSON.stringify({path: path.deviceid})
                    })
                    .then(res => res.json())
                    .then(dta => {
                        console.log(dta)
                        alert("Lưu thành công")
                    })
                    .catch((err) => {console.error(err); alert("Lưu thất bại do chọn sai USB")})
                }
            }}>Hoàn tất chỉnh sửa</Button>
            <label for="usb"><h6>USB: </h6></label>
            <select id="usb" name="usb" className="ms-1 bg-black" onChange={(e) => {
                setPath(paths[e.target.value])
                setData([])
                setStatus("")
                setContent([<p key="text">Chọn đúng USB ở bên trái và nhấn vào một lịch phát ở bảng bên trái để chỉnh sửa thông tin lịch phát đó. Chỉnh sửa xong, nhấn Hoàn tất chỉnh sửa ở bên trái để lưu lại. Quá trình lưu cần Internet và có thể mất từ vài phút tuỳ thuộc tốc độ mạng của bạn.</p>])
            }}>
                {pathInput}
            </select>
            <Button className="border-white bg-black ms-2" onClick={() => window.location.reload()}>Làm mới danh sách</Button>
        </Container>
            <strong className="mb-2 mt-2">{status}</strong>
            <Table bordered data-bs-theme="dark" className="text-center pe-2">
                <thead>
                    <tr>
                        <td><strong>STT</strong></td>
                        <td><strong>Lịch phát</strong></td>
                    </tr>
                </thead>
                <tbody>
                    {makeTable()}
                    <tr className="cell" onClick={() => add("config")}>
                        <td colSpan={2}><Button className="border-white bg-black">Thêm lịch phát</Button></td>
                    </tr>
                </tbody>
            </Table>
        </Container>

        <Container id="modPanel" className="border-start">
            {content}
        </Container>
    </>)
}