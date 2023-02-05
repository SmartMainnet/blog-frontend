import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Container from '@mui/material/Container'
import { Header } from './components'
import { Home, FullPost, Registration, AddPost, Login } from './pages'
import { fetchAuthMe } from './redux/slices/auth'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAuthMe())
  }, [])

  return (
    <>
      <Header />
      <Container maxWidth='lg'>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/register' element={<Registration />} />
          <Route exact path='/add-post' element={<AddPost />} />
          <Route exact path='/posts/:id' element={<FullPost />} />
          <Route exact path='/posts/:id/edit' element={<AddPost />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
