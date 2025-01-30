import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import HistoryItem from "./HistoryItem";
const mockData = {
  success: true,
  data: Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 20}`,
    sender_name: "xper ouhadou",
    created_at: new Date().toISOString(),
  })),
};

const ViewsHistoryTab = () => {
  return (
    <TabsContent value="views" className="h-full m-0">
      <div className="space-y-4 pr-4">
        {mockData.data.map((item) => (
          <HistoryItem key={item.id} data={item} />
        ))}
      </div>
    </TabsContent>
  );
};

export default ViewsHistoryTab;
