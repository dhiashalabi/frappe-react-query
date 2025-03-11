import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { Login, Logout } from './components/login'
import { Users } from './pages/Users'

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <h1>Frappe React Query</h1>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                    </ul>
                </nav>
                <div className="card">
                    <Routes>
                        <Route
                            path="/users"
                            element={<Users />}
                        />
                        <Route
                            path="/"
                            element={
                                <>
                                    <Login />
                                    <Logout />
                                </>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App
