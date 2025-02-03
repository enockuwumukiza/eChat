import React ,{ Suspense,useEffect} from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import ChatPage from './pages/ChatPage'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import Loader from './utils/Loader'
import { useAuth } from './hooks/useAuth'
import NewChat from './miscellaneous/NewChat'
import InternetStatus from './utils/InternetStatus'
import SendingAnimation from './utils/SendingAnimation'
import VideoCall from './audio-chats/VideoCall'
import VoiceCall from './audio-chats/VoiceCall'
import NotificationModal from './miscellaneous/NotificationModal'

import SimpleHeader from './components/SimpleHeader'


const App: React.FC = () => {

  

  const { authUser } = useAuth();
  const currentWindowWidth = useSelector((state: RootState) => state.display.currentWindowWidth);


  
  return (
    <Suspense fallback={<Loader />}>
      <InternetStatus/>
      <Routes>
        <Route path='/' element={authUser ? <Home />: <Navigate to={'/login'} />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/signup' element={ <SignupPage/> } />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/new' element={<NewChat />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/send' element={<SendingAnimation />} />
        <Route path='/video' element={<VideoCall />} />
        <Route path='/voice' element={<VoiceCall />} />
        <Route path='/notify' element={<NotificationModal />} />
        <Route path='/head' element={<SimpleHeader/>} />
        
      </Routes>
      <VoiceCall />
      <VideoCall/>
      <ToastContainer
        position={`${Number(currentWindowWidth) > 1024 ? "bottom-left":"top-right"}`}
      />
    </Suspense>
    
  )
}

export default App
