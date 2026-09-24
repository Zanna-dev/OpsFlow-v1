import { Routers } from "./routes/Routers";
import { AuthProvider } from "./context/AuthProvider";
export default function App() { return <AuthProvider><Routers /></AuthProvider>; }
