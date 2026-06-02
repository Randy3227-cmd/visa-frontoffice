import { Routes, Route } from 'react-router-dom'
import ListeDemandes from './pages/ListeDemandes.jsx'
import Form from './pages/Form.jsx'
import InsertionForm from './pages/InsertionForm.jsx'
import QRCodePage from './pages/QRCodePage.jsx'
import DemandeDetail from './pages/DemandeDetail.jsx'
import CapturePhotoSignature from './pages/CapturePhotoSignature.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/demandes/:numero" element={<ListeDemandes />} />
      <Route path="/insertion" element={<InsertionForm />} />
      <Route path="/form/success/:id" element={<QRCodePage />} />
      <Route path="/demande/:id" element={<DemandeDetail />} />
      <Route path="/demande/:id/capture" element={<CapturePhotoSignature />} />
    </Routes>
  )
}

export default App