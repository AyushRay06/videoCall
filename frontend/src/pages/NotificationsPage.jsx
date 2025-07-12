import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { acceptFriendRequest, getFriendRequests } from "../lib/api"
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react"
import NoNotificationsFound from "../components/NoNotificationsFound"

const NotificationsPage = () => {
  const queryClient = useQueryClient()
  // queary to get all incomingFriendRequest
  const {
    data: friendRequests,
    isPending,
    error,
  } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  })

  // mutation to accept the incoming friend request

  const { mutate: acceptRequestMutaion } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      // to refetch the incoming freiend req as we accepted some so the data will be updated so that we no longer see the old old friend request
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
      // to fetch the new friend which were created as we accepted their friend request and display under the new friends in notification page.
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
  })

  const incomingRequest = friendRequests.incomingReqs || []
  const acceptedRequest = friendRequests.acceptedReqs || []

  return <div></div>
}

export default NotificationsPage
