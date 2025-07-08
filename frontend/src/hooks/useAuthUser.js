import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAuthUser } from "../lib/api"

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // we dont need it to retry after fail as it is auth check
  })

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user }
}

export default useAuthUser
