import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { teamCourses } from "../../../apis/course";
import { Controller } from "react-hook-form";

export default function PostCourses({ control, setValue, getValues }) {
  const [teamMemberCourses, setTeamMemberCourses] = useState([]);
  useEffect(() => {
    teamCourses().then((res) => setTeamMemberCourses(res.courses));
  }, []);

  const handleCheckboxChange = (event) => {
    let { value, checked } = event.target;
    // value = value.slice(value.length - 8, value.length);

    if (checked) {
      setValue("courses", [...getValues("courses"), value]);
    } else {
      setValue(
        "courses",
        getValues("courses").filter((item) => item !== value)
      );
    }
  };

  return (
    <FormGroup>
      {teamMemberCourses?.map((teamMemberCourse, index) => (
        <FormControlLabel
          key={teamMemberCourse.id}
          control={
            <Controller
              name="courses"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  value={teamMemberCourse.id.toString()}
                  checked={field.value.includes(teamMemberCourse.id.toString())}
                  onChange={handleCheckboxChange}
                />
              )}
            />
          }
          label={
            teamMemberCourse.name +
            ` ( ${teamMemberCourse.code} , ${teamMemberCourse.prof} )`
          }
        />
      ))}
    </FormGroup>
  );
}
