import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

export default function PostStudyTime({ setValue, getValues, control }) {
  return (
    <Box sx={{ display: "flex", gap: "30px" }}>
      <Box sx={{ width: "100%" }}>
        <Typography>스터디 시간</Typography>
        <Controller
          name="totalMinutes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              sx={{ width: "100%", mt: 2 }}
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">분</InputAdornment>
                ),
              }}
            />
          )}
          placeholder="숫자 입력"
        />
      </Box>
    </Box>
  );
}
