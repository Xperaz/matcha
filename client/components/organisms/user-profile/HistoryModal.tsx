import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { FC } from "react";
import LikesHistoryTab from "./LikesHistoryTab";
import ViewsHistoryTab from "./ViewsHistoryTab";

interface IHistoryModalProps {
  onClose: () => void;
}

const HistoryModal: FC<IHistoryModalProps> = ({ onClose }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col overflow-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>History</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="views" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger
              value="views"
              className="data-[state=active]:bg-[#E51A5C] data-[state=active]:text-white"
            >
              Profile Views
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="data-[state=active]:bg-[#E51A5C] data-[state=active]:text-white"
            >
              Likes
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-auto">
            <LikesHistoryTab />
            <ViewsHistoryTab />
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
