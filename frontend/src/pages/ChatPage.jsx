import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router"
import { getAuthUser, getStreamToken } from "../lib/api"
import { useState } from "react"
import { User, Channel as StreamChannel } from "stream-chat"
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react"

const ChatPage = () => {
  const { id: targetUserId } = useParams()

  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)

  const queryClient = useQueryClient()
  const { authUser } = getAuthUser()

  const { data } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    // useQuery fn run by itself but we first  need authUser to execute so
    // the enable property helps us do that
    // here !!authUser means boolean(authUser)
    enabled: !!authUser,
  })

  return (
    <div>
      {" "}
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
