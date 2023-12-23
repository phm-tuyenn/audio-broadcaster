import { Button, Container, Table } from "react-bootstrap"
import PageTitle from "../components/PageTitle"
import "./css/schedule.css"
import { useState } from "react"
let config = require("../config.json")

export default function Schedule() {
    return (<>
        <PageTitle name="Cài đặt lịch phát"></PageTitle> 
        <Container style={{ width: "50%", float: "left" }}>
            <Table bordered data-bs-theme="dark" className="text-center">
                <thead>
                    <tr>
                        <td>STT</td>
                        <td>Lịch phát</td>
                        <td>Hành động</td>
                    </tr>
                </thead>
                <tbody>{}</tbody>
            </Table>
        </Container>
    </>)
}