import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { INTERESTS } from "@/constants/interests";
import { SearchFilters, useExploreContext } from "@/context/exploreContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { FC } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";

interface Props {
  onClose: () => void;
}

export const AdvancedSearch: FC<Props> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { filters, setFilters } = useExploreContext();

  const handleAgeRangeChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, ageRange: value as [number, number] }));
  };

  const handleFameRangeChange = (value: number[]) => {
    setFilters((prev: SearchFilters) => ({
      ...prev,
      fameRange: value as [number, number],
    }));
  };

  const handleDistanceChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, distance: value as [number, number] }));
  };

  const toggleInterest = (interest: string) => {
    if (!interest) return;
    if (filters.interests.length >= 5 && !filters.interests.includes(interest))
      return;

    setFilters((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Advanced Search </AlertDialogTitle>
          <AlertDialogDescription>
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
                <label className="text-sm font-medium">Fame Rating</label>
                <DualRangeSlider
                  defaultValue={filters.fameRange}
                  max={5}
                  min={1}
                  step={1}
                  onValueChange={handleFameRangeChange}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.fameRange[0]}</span>
                  <span>{filters.fameRange[1]}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Distance (miles)</label>
                <DualRangeSlider
                  defaultValue={filters.distance}
                  max={500}
                  min={1}
                  step={1}
                  onValueChange={handleDistanceChange}
                />
                <div className="text-sm text-muted-foreground">
                  Within {filters.distance} miles
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={
                        filters.interests.includes(interest)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: SearchFilters["sortBy"]) =>
                    setFilters((prev) => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="fame_rating">Fame Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                ageRange: [18, 100],
                fameRange: [1, 5],
                distance: [1, 500],
                interests: [],
                sortBy: "age",
              }));
              onClose();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.explore] });
              onClose();
            }}
          >
            Apply Filters
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
