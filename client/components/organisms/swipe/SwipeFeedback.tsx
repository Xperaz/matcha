import { useSwipeCardContext } from "@/context/swipeCardContext";
import useSocketSetup from "@/hooks/useSocketSetup";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const feedBackText = (swipeFeedbackState: string) => {
  if (swipeFeedbackState === "right") {
    return "LIKE!";
  } else if (swipeFeedbackState === "left") {
    return "DISLIKE!";
  } else {
    return "";
  }
};

const Match = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center space-y-4 bg-primary px-8 py-12 rounded-lg shadow-lg">
        <Heart className="w-16 h-16 text-pink-50 animate-pulse" />
        <h1 className="text-3xl font-bold text-white">It&apos;s a Match!</h1>
      </div>
    </div>
  );
};

const feedBackColor = (swipeFeedbackState: string) => {
  if (swipeFeedbackState === "right") {
    return "text-primary ";
  } else if (swipeFeedbackState === "left") {
    return "text-warning";
  } else {
    return "";
  }
};

export const SwipeFeedback = () => {
  const socket = useSocketSetup();
  const { swipeFeedbackState } = useSwipeCardContext();
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    socket.on("new_match", () => {
      setIsMatch(true);
      setTimeout(() => {
        setIsMatch(false);
      }, 3000);
    });
    return () => {
      socket.off("swipe_feedback");
    };
  });

  return (
    <>
      {isMatch ? (
        <Match />
      ) : (
        <div
          className={`top-10 left-0 right-0 text-center text-2xl font-bold mb-4 px-2 ${feedBackColor(swipeFeedbackState)}`}
        >
          <h1>{feedBackText(swipeFeedbackState)}</h1>
        </div>
      )}
    </>
  );
};
