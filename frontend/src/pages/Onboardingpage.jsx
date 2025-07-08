import { useMutation, useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { completeOnboarding } from "../lib/api"
import useAuthUser from "../hooks/useAuthUser"
import toast from "react-hot-toast"

export const Onboardingpage = () => {
  const queryClient = useQueryClient()
  const { authUser } = useAuthUser()

  const [onBoardingData, setOnBoardingData] = useState({
    fullName: "" || authUser?.fullName,
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    profilePic: "" || authUser?.profilePic,
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
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {" "}
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              {/* Generate Random Avatar BTN */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                name="fullName"
                type="text"
                placeholder="Your full name"
                value={onBoardingData.fullName}
                onChange={(e) =>
                  setOnBoardingData({
                    ...onBoardingData,
                    fullName: e.target.value,
                  })
                }
                className="input input-bordered w-full"
              />
            </div>
            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <input
                name="bio"
                type="text"
                placeholder="Tell others about yourself and your language learning goals"
                className="textarea textarea-bordered h-24"
                onChange={(e) =>
                  setOnBoardingData({ ...onBoardingData, bio: e.target.value })
                }
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={onBoardingData.nativeLanguage}
                  onChange={(e) =>
                    setOnBoardingData({
                      ...onBoardingData,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={onBoardingData.learningLanguage}
                  onChange={(e) =>
                    setOnBoardingData({
                      ...onBoardingData,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={onBoardingData.location}
                  onChange={(e) =>
                    setOnBoardingData({
                      ...onBoardingData,
                      location: e.target.value,
                    })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>
            {/* SUBMIT BUTTON */}

            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
