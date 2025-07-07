import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { NotificationPage } from "./pages/NotificationPage"
import { ChatPage } from "./pages/ChatPage"
import { Onboardingpage } from "./pages/Onboardingpage"
import { Navigate, Route, Routes } from "react-router"
import CallPage from "./pages/CallPage"
import toast, { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"

const App = () => {
  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me")
      return res.data
    },
    retry: false,
  })

  const authUser = authData?.user

  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/call" element={authUser?<CallPage />:<Navigate to=""/>} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/onboarding" element={<Onboardingpage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
