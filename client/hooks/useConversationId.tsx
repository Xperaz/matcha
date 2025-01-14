import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversationId = () => {
  const params = useParams();

  const conversationId = useMemo(
    () => params?.conversationId || ("" as string),
    [params?.conversationId],
  );

  const isActive = useMemo(() => !!conversationId, [conversationId]);

  return {
    conversationId,
    isActive,
  };
};

export default useConversationId;
