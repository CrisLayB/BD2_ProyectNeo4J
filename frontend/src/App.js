import './App.css';
import React, { useState } from 'react'
// Importar páginas
import Login from './pages/Login'
import Register from './pages/Register'
import Blog from './pages/Blog'
import Explore from './pages/Explore'
import Header from './pages/components/Header'
import UpdateUser from './pages/UpdateUser'
import Dashbord from './pages/Dashbord'

const App = () => {
  const [token, setToken] = useState(null)
  // ready = -1, login = 0, register = 1
  const [ready, setReady] = useState(0)
  const [page, setPage] = useState('blog')

  if (!token) {
    return (
        <div>
            {ready === 0 && (
                <Login setToken={setToken} setReady={setReady} />
            )}
            {ready === 1 && (
                <Register setToken={setToken} setReady={setReady} />
            )}
        </div>
    )
  }
  
  return (
    <div className="App">
      <Header user={token} setUser={setToken} setPage={setPage} />
      {page === 'blog' && <Blog user={token} />}
      {page === 'explorar' && <Explore user={token} />}
      {page === 'UpdateUser' && <UpdateUser user={token} />}
      {page === 'Dashboard' && <Dashbord user={token} />}
    </div>
  );
}

export default App;
