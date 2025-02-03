import { FC } from "react";

import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { useSwipeCardContext } from "@/context/swipeCardContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  onClose: () => void;
}

const Filters: FC<FiltersProps> = ({ onClose }) => {
  const { filters, setFilters } = useSwipeCardContext();

  const handleAgeRangeChange = (value: number[]) => {
    setFilters({
      ...filters,
      ageRange: value as [number, number],
    });
  };

  const handleDistanceRangeChange = (value: number[]) => {
    setFilters({
      ...filters,
      distanceRange: value as [number, number],
    });
  };

  const handleFameRatingChange = (value: number[]) => {
    setFilters({
      ...filters,
      fameRatingRange: value as [number, number],
    });
  };

  const handleCommonInterestsChange = (value: number[]) => {
    setFilters({
      ...filters,
      commonInterests: value[1],
    });
  };

  const handleSortByChange = (value: string) => {
    setFilters({
      ...filters,
      sortBy: value,
    });
  };

  const resetFilters = () => {
    setFilters({
      ageRange: [18, 100],
      distanceRange: [0, 500],
      fameRatingRange: [1, 100],
      commonInterests: 0,
      sortBy: "distance",
    });
    onClose();
  };

  return (
    <Dialog defaultOpen onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="py-4">Filters</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Age Range</label>
                <DualRangeSlider
                  defaultValue={filters.ageRange}
                  max={100}
                  min={18}
                  step={1}
                  onValueChange={handleAgeRangeChange}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.ageRange[0]}</span>
                  <span>{filters.ageRange[1]}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Distance (km)</label>
                <DualRangeSlider
                  defaultValue={filters.distanceRange}
                  max={500}
                  min={0}
                  step={1}
                  onValueChange={handleDistanceRangeChange}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.distanceRange[0]}</span>
                  <span>{filters.distanceRange[1]}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fame Rating</label>
                <DualRangeSlider
                  defaultValue={filters.fameRatingRange}
                  max={100}
                  min={1}
                  step={1}
                  onValueChange={handleFameRatingChange}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.fameRatingRange[0]}</span>
                  <span>{filters.fameRatingRange[1]}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Common Interests</label>
                <DualRangeSlider
                  defaultValue={[0, filters.commonInterests]}
                  max={5}
                  min={0}
                  step={1}
                  onValueChange={handleCommonInterestsChange}
                />
                <div className="text-sm text-muted-foreground">
                  At least {filters.commonInterests} common interests
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={handleSortByChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="common_interests">
                      Common interests
                    </SelectItem>
                    <SelectItem value="fame_rating">Fame Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={resetFilters} variant="outline">
            Cancel
          </Button>
          <Button onClick={onClose}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Filters;
