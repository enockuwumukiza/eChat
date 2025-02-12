import React ,{ Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
const  ChatPage = lazy(()  => import( './pages/ChatPage'))
import Home from './pages/Home'
const  LoginPage = lazy(()  => import( './pages/LoginPage'))
const  SignupPage = lazy(()  => import( './pages/SignupPage'))
const  NotFoundPage = lazy(()  => import( './pages/NotFoundPage'))
import Loader from './utils/Loader'
import { useAuth } from './hooks/useAuth'
const  NewChat = lazy(()  => import( './miscellaneous/NewChat'))
const  InternetStatus = lazy(()  => import( './utils/InternetStatus'))
const  VideoCall = lazy(()  => import( './audio-chats/VideoCall'))
const  VoiceCall = lazy(()  => import( './audio-chats/VoiceCall'))
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
