import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useSwipeCardContext } from "@/context/swipeCardContext";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";

const CustomSelect = () => {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useSwipeCardContext();

  const handleSortByChange = (value: string) => {
    setFilters({
      ...filters,
      sortBy: value,
    });
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        {filters.sortBy || "Sort by..."}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Sort By</DialogTitle>
            <DialogDescription>{""}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            {["distance", "age", "fame_rating", "interests"].map((value) => (
              <Button
                key={value}
                variant="ghost"
                className={`${
                  filters.sortBy === value ? "bg-gray-200" : ""
                } w-full`}
                onClick={() => handleSortByChange(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomSelect;
