import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login } from "../lib/api"

const useLogin = async () => {
  const queryClient = useQueryClient()
  const {
    isPending,
    mutation: loginMutation,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },
  })

  return { isPending, error, loginMutation }
}

export default useLogin
