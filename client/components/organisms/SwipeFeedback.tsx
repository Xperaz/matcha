import { useSwipeCardContext } from "@/context/swipeCardContext";

const feedBackText = (swipeFeedbackState: string) => {
  if (swipeFeedbackState === "right") {
    return "LIKE!";
  } else if (swipeFeedbackState === "left") {
    return "DISLIKE!";
  } else {
    return "";
  }
};

const feedBackColor = (swipeFeedbackState: string) => {
  if (swipeFeedbackState === "right") {
    return "text-green-500 border-green-500 border-4 rounded-lg";
  } else if (swipeFeedbackState === "left") {
    return "text-red-500 border-red-500 border-4 rounded-lg";
  } else {
    return "";
  }
};
export function SwipeFeedback() {
  const { swipeFeedbackState } = useSwipeCardContext();

  return (
    //make this appear on the screen for 3 seconds
    <div
      className={` top-10 left-0 right-0 text-center text-2xl font-bold mb-4 px-2 ${feedBackColor(swipeFeedbackState)}`}
    >
      <h1>{feedBackText(swipeFeedbackState)}</h1>
    </div>
  );
}
