import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CategoryDropDown({value, onChange}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Course Category</SelectLabel>
          <SelectItem value="appNext JS">Next JS</SelectItem>
          <SelectItem value="Frontend Development">Frontend Development</SelectItem>
          <SelectItem value="Full Stack Devlopment">Full Stack Devlopment</SelectItem>
          <SelectItem value="Mern Stack Development">Mern Stack Development</SelectItem>
          <SelectItem value="Backend Devlopment">Backend Devlopment</SelectItem>
          <SelectItem value="Python">Python</SelectItem>
          <SelectItem value="Cpp">Cpp</SelectItem>
          <SelectItem value="App Development">App Development</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
