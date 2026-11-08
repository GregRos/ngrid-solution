import "bootstrap/dist/css/bootstrap.min.css"
import "./components/reusable/common.scss"
import { createRoot } from "react-dom/client"
import { App } from "./components/App"

const root = document.getElementById("root")
if (!root) throw new Error("Missing root element")
createRoot(root).render(<App />)
