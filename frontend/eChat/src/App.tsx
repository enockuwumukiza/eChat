import React ,{ Suspense,useEffect, useState} from 'react'
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
import VideoCall from './audio-chats/VideoCall'
import VoiceCall from './audio-chats/VoiceCall'
import { useListenNotifications } from './hooks/useListenNotifications'



const App: React.FC = () => {

  useListenNotifications();

  

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
