import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signup } from "../lib/api"

const useSignup = async () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    mutate: signupMutation,
    error,
  } = useMutation({
    mutationFn: signup,
    // basicaly after the user is signed in it again featches teh signedin user
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },
  })
  return { isPending, error, signupMutation }
}

export default signup
