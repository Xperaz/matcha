"use client";
import React, { useState } from "react";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { Button } from "@/components/ui/button";
import { useSwipeCardContext } from "@/context/swipeCardContext";

const Filters = () => {
  const [ageRange, setAgeRange] = useState([18, 100]);
  const [distanceRange, setDistanceRange] = useState([0, 500]);
  const [fameRatingRange, setFameRatingRange] = useState([1, 100]);
  const [commonInterests, setCommonInterests] = useState([0, 5]);
  const { setFilters } = useSwipeCardContext();

  const applyFilters = () => {
    setFilters({
      ageRange,
      distanceRange,
      fameRatingRange,
      commonInterests: commonInterests[1],
    });
  };

  return (
    <div className="flex flex-col w-full items-center gap-8">
      <div className="w-1/2 px-10 flex justify-between gap-4">
        <p className="text-lg font-bold">Age</p>
        <DualRangeSlider
          label={(value) => value}
          value={ageRange}
          onValueChange={setAgeRange}
          min={18}
          max={100}
          step={1}
        />
      </div>
      <div className="w-1/2 px-10 flex justify-between gap-4">
        <p className="text-lg font-bold">distance(km)</p>
        <DualRangeSlider
          label={(value) => value}
          value={distanceRange}
          onValueChange={setDistanceRange}
          min={1}
          max={500}
          step={1}
        />
      </div>
      <div className="w-1/2 px-10 flex justify-between gap-4">
        <p className="text-lg font-bold">fame_rating</p>
        <DualRangeSlider
          label={(value) => value}
          value={fameRatingRange}
          onValueChange={setFameRatingRange}
          min={1}
          max={100}
          step={1}
        />
      </div>
      <div className="w-1/2 px-10 flex justify-between gap-4">
        <p className="text-lg font-bold">common_interests</p>
        <DualRangeSlider
          label={(value) => value}
          value={commonInterests}
          onValueChange={setCommonInterests}
          min={0}
          max={5}
          step={1}
        />
      </div>
      <Button onClick={applyFilters}>Apply Filters</Button>
    </div>
  );
};

export default Filters;
