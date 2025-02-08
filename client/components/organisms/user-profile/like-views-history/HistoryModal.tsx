import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { FC, useState } from "react";
import LikesHistoryTab from "./LikesHistoryTab";
import ViewsHistoryTab from "./ViewsHistoryTab";

interface IHistoryModalProps {
  onClose: () => void;
}

const HistoryModal: FC<IHistoryModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("views");
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col overflow-auto">
        <DialogHeader className="flex-shrink-0 gap-2">
          <DialogTitle className="text-center">History</DialogTitle>
          <DialogDescription className="text-sm text-center">
            See who viewed your profile and who liked you
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="views"
          className="flex-1 flex flex-col"
          value={activeTab}
          onValueChange={setActiveTab}
        >
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
            {activeTab === "likes" && <LikesHistoryTab />}
            {activeTab === "views" && <ViewsHistoryTab />}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
