import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "../lib/api"

const useLogout = async () => {
  const queryClient = useQueryClient()
  const {
    isPending,
    error,
    mutation: logoutMutation,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },
  })
  return { isPending, error, logoutMutation }
}

export default useLogout
