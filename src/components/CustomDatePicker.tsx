"use client";

import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomDatePicker({ value, onChange }: Props) {
  const dateValue = value ? dayjs(value) : null;

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onChange(newValue.format("DD/MM/YYYY"));
    } else {
      onChange("");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={dateValue}
        onChange={handleChange}
        format="DD/MM/YYYY"
        className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </LocalizationProvider>
  );
}
