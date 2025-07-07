import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { NotificationPage } from "./pages/NotificationPage"
import { ChatPage } from "./pages/ChatPage"
import { Onboardingpage } from "./pages/Onboardingpage"
import { Route, Routes } from "react-router"
import CallPage from "./pages/CallPage"
import toast, { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/onboarding" element={<Onboardingpage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
