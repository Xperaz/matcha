import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { QUERY_KEYS } from "@/constants/query_keys";
import { MessageFormValue } from "@/schemas/MessageSchema";
import { sendMessage } from "@/services/requests/messages";
import { Description } from "@radix-ui/react-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}

export const SendMessageModal = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
}: SendMessageModalProps) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { mutate: sendMessageMutate, isPending } = useMutation({
    mutationFn: async (payload: MessageFormValue) => {
      return sendMessage(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.chatList] });
      onClose();
      router.push(`/messages/${recipientId}`);
    },
  });

  const handleSend = () => {
    sendMessageMutate({ content: message, receiver_id: recipientId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Send Message to {recipientName}</DialogTitle>
          <Description>{""}</Description>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isPending}>
            {isPending ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
