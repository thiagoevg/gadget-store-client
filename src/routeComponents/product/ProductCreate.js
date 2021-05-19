import { useState } from "react";
import { useHistory } from "react-router-dom";

import api from "../../apis/index";

import ProductForm from "./ProductForm";




function ProductCreate() {
  const history = useHistory();

  const [state, setState] = useState({
    category: "",
    model: "",
    brand: "Apple",
    description: "",
    discount: "",
    image_url: "",
    cost: 0,
    price: 0,
    qtt_in_stock: 0,
    color: '',
    condition: ''
  });

  function handleChange(event) {
    if (event.target.files) {
      console.log(event.target.files)
      setState({ ...state, [event.target.name]: event.target.files });
    } else {
      setState({ ...state, [event.target.name]: event.target.value });
    }
  }
  console.log(state)

  async function handleFileUpload(file) {
    try {
      // FormData is a native Javasccript constructor function which creates a Form object in the multipart/form format expected in the backend
      const uploadData = new FormData();

      // 'image' needs to match same value of uploadCloud.single() in the backend
      uploadData.append("image", file);
      for (let key of uploadData.entries()) {
        console.log(key[1]);
      }

      const response = await api.post("/image-upload", uploadData);

      return response.data.fileUrl;
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();

      let uploadedImageUrl = "";
      let auxArr = []
      if (state.image_url) {
        for (let file of Object.values(state.image_url)) {
          uploadedImageUrl = await handleFileUpload(file);
          auxArr.push(uploadedImageUrl)
        }
      }

      const response = await api.post("/product", {
        ...state,
        image_url: auxArr,
      });

      // Programmatically redirects to URL '/'
      history.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>New Gadget </h1>

      <hr />

      <ProductForm
        state={state}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default ProductCreate;
