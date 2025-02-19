import React ,{ Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import Home from './pages/Home'
import Loader from './utils/Loader'
import { useAuth } from './hooks/useAuth'
import { useListenNotifications } from './hooks/useListenNotifications'
import WelcomePage from './pages/WelcomePage'


const  InternetStatus = lazy(()  => import( './utils/InternetStatus'))
const  VideoCall = lazy(()  => import( './audio-chats/VideoCall'))
const VoiceCall = lazy(() => import('./audio-chats/VoiceCall'))
const  LoginPage = lazy(()  => import( './pages/LoginPage'))
const  SignupPage = lazy(()  => import( './pages/SignupPage'))
const  NotFoundPage = lazy(()  => import( './pages/NotFoundPage'))




const App: React.FC = () => {

  useListenNotifications();

  

  const { authUser } = useAuth();
  const currentWindowWidth = useSelector((state: RootState) => state.display.currentWindowWidth);



  
  return (
    <Suspense fallback={<Loader />}>
      <InternetStatus/>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={'/welcome'} />} />
        <Route path='/welcome' element={ <WelcomePage/> } />
        <Route path='/signup' element={ <SignupPage/> } />
        <Route path='/login' element={<LoginPage />} />
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
