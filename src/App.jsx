import { Routes, Route } from 'react-router-dom'
import ListeDemandes from './pages/ListeDemandes.jsx'
import Form from './pages/Form.jsx'
import InsertionForm from './pages/InsertionForm.jsx'
import QRCodePage from './pages/QRCodePage.jsx'
import DemandeDetails from './pages/DemandeDetails.jsx'
import CapturePage from './pages/CapturePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/demandes/:numero" element={<ListeDemandes />} />
      <Route path="/insertion" element={<InsertionForm />} />
      <Route path="/form/success/:id" element={<QRCodePage />} />
      <Route path="/demande/:id" element={<DemandeDetails />} />
      <Route path="/demande/:id/capture" element={<CapturePage />} />
    </Routes>
  )
}

export default App