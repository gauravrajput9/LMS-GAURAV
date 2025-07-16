import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CourseLevel = ({ value, onChange }) => {
  return (
    <div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Level For Your Course" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Course Level</SelectLabel>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CourseLevel;
