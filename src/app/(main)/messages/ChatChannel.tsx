import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState, useCallback, useRef } from "react";
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
    Component: () => <>😠</>,
    name: "Angry",
  },
];

const CustomMessage = (props: any) => {
  const [showReactions, setShowReactions] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = useCallback(() => {
    touchStartTime.current = Date.now();
    longPressTimer.current = setTimeout(() => {
      setShowReactions(true);
    }, 500); // 500ms for long press
  }, []);

  const handleTouchEnd = useCallback(() => {
    const pressDuration = Date.now() - touchStartTime.current;
    if (pressDuration < 500) {
      // If it was a short press, clear the timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    // Clear the timer if the user moves their finger
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, []);

  return (
    <div
      className="relative group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <MessageSimple {...props} />
      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 flex gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-200 ease-in-out">
          {customReactionOptions.map((reaction) => (
            <button
              key={reaction.type}
              className="hover:scale-125 transition-transform duration-200"
              onClick={() => {
                // Handle reaction click
                if (props.handleReaction) {
                  props.handleReaction(reaction.type);
                }
                setShowReactions(false);
              }}
            >
              <reaction.Component />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ChatChannel({ open, openSidebar }: ChatChannelProps) {
  return (
    <div className={cn("w-full md:block", !open && "hidden")}>
      <Channel reactionOptions={customReactionOptions}>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList Message={CustomMessage} />
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