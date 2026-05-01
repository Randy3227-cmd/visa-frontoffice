import { Routes, Route } from 'react-router-dom'
import ListeDemandes from './pages/ListeDemandes.jsx'
import Form from './pages/Form.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/demandes/:numero" element={<ListeDemandes />} />
    </Routes>
  )
}

export default App