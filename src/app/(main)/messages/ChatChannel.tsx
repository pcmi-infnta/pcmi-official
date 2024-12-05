import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  MessageSimple,
  Window,
} from "stream-chat-react";

interface ChatChannelProps {
  open: boolean;
  openSidebar: () => void;
}

// Define custom reaction options according to the documentation
const customReactionOptions = [
  {
    type: "love",
    Component: () => <>❤️</>,
    name: "Love",
  },
  {
    type: "like",
    Component: () => <>👍</>,
    name: "Like",
  },
  {
    type: "haha",
    Component: () => <>😂</>,
    name: "Haha",
  },
  {
    type: "wow",
    Component: () => <>😮</>,
    name: "Wow",
  },
  {
    type: "sad",
    Component: () => <>😢</>,
    name: "Sad",
  },
  {
    type: "angry",
    Component: () => <>😎</>,
    name: "Angry",
  },
];

export default function ChatChannel({ open, openSidebar }: ChatChannelProps) {
  return (
    <div className={cn("w-full md:block", !open && "hidden")}>
      <Channel reactionOptions={customReactionOptions}>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

function CustomChannelHeader({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}