import { useState } from "react";
import { importCourses } from "../../apis/course";
import axios from "axios";

//path variable을 써야한다는데..?

export default function ImportCSV() {
  const [selectedFile, setSelectedFile] = useState();

  const handleSubmit = async (e) => {
    // e.preventDefault();

    const formData = new FormData();

    // Array.from(selectedFile).forEach((el) => {
    // formData.append("file", selectedFile);
    // });

    // const response = await importCourses(formData);

    // // try {
    // //   const TOKEN = localStorage.getItem("accessToken");

    // //   const response = await axios.post(
    // //     `${import.meta.env.VITE_BACK_BASE_URL}/api/course`,
    // //     formData,
    // //     {
    // //       headers: {
    // //         "Content-Type": "multipart/form-data",
    // //         Authorization: `Bearer ${TOKEN}`,
    // //         withCredentials: true,
    // //       },
    // //       transfromRequest: [
    // //         function () {
    // //           return formData;
    // //         },
    // //       ],
    // //     }
    // //   );

    //   console.log(response);
    // } catch (error) {
    //   console.log("!!");
    //   console.log(error);
    // }

    formData.append("file", selectedFile);

    // console.log(selectedFile);
    console.log(importCourses(formData));
  };

  const handleChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <>
      <input type="file" onChange={handleChange} />
      <button onClick={handleSubmit}>제출</button>
    </>
  );
}
