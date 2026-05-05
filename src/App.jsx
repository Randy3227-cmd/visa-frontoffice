import { Routes, Route } from 'react-router-dom'
import ListeDemandes from './pages/ListeDemandes.jsx'
import Form from './pages/Form.jsx'
import InsertionForm from './pages/InsertionForm.jsx'
import QRCodePage from './pages/QRCodePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/demandes/:numero" element={<ListeDemandes />} />
      <Route path="/insertion" element={<InsertionForm />} />
      <Route path="/form/success/:id" element={<QRCodePage />} />
    </Routes>
  )
}

export default App