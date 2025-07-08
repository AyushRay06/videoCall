import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { NotificationPage } from "./pages/NotificationPage"
import { ChatPage } from "./pages/ChatPage"
import { Onboardingpage } from "./pages/Onboardingpage"
import { Navigate, Route, Routes } from "react-router"
import CallPage from "./pages/CallPage"
import { Toaster } from "react-hot-toast"
import PageLoader from "./components/PageLoader"
import useAuthUser from "./hooks/useAuthUser"

const App = () => {
  const { isLoading, authUser } = useAuthUser()

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  if (isLoading) {
    return <PageLoader />
  }
  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <HomePage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/call"
          element={isAuthenticated ? <CallPage /> : <Navigate to="" />}
        />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/onboarding" element={<Onboardingpage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
