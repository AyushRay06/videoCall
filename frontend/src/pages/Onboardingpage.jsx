import { useMutation, useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { completeOnboarding } from "../lib/api"
import useAuthUser from "../hooks/useAuthUser"
import toast from "react-hot-toast"

export const Onboardingpage = () => {
  const queryClient = useQueryClient()
  const { authUser } = useAuthUser()

  const [onBoardingData, setOnBoardingData] = useState({
    fullName: "" || authUser.fullName,
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
  })
  const { mutation: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully.")
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },

    onError: () => {
      toast.error(error.response.data.message)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onboardingMutation()
  }

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1 // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

    setFormState({ ...formState, profilePic: randomAvatar })
    toast.success("Random profile picture generated!")
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
          </form>
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* IMAGE PREVIEW */}
            <div className="size-32 rounded-full bg-base-300 overflow-hidden"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
