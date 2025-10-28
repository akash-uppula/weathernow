import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import WeatherNow from './components/WeatherNow'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<WeatherNow/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
