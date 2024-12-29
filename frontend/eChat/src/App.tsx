import React ,{ Suspense} from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import {  ToastContainer } from 'react-toastify'
import ChatPage from './pages/ChatPage'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import Loader from './utils/Loader'
import { useAuth } from './hooks/useAuth'
import SideDrawer from './miscellaneous/SideDrawer'
import NewChat from './miscellaneous/NewChat'

import VoiceRecorder from './components/VoiceRecorder'
import InternetStatus from './utils/InternetStatus'
import SendingAnimation from './utils/SendingAnimation'




const App: React.FC = () => {

  

  const { authUser } = useAuth();

  
  return (
    <Suspense fallback={<Loader />}>
      <InternetStatus/>
      <Routes>
        <Route path='/' element={authUser ? <Home />: <Navigate to={'/login'} />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/signup' element={ <SignupPage/> } />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/drawer' element={<SideDrawer />} />
        <Route path='/new' element={<NewChat />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/send' element={<SendingAnimation/>} />
        <Route path='/voice' element={<VoiceRecorder/>} />
        
      </Routes>
      <ToastContainer
        position={'bottom-left'}
      />
    </Suspense>
    
  )
}

export default App
