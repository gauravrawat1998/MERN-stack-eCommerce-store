import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { getCategory, updateCategory } from "./helper/adminapicall";

const UpdateCategory = ({ match }) => {
  const { user, token } = isAuthenticated();
  const [value, setValue] = useState({
    name: "",
    error: "",
    success: "",
  });

  const { name, error, success } = value;

  const preLoad = (categoryId) => {
    getCategory(categoryId).then((data) => {
      if (data.error) {
        setValue({ ...value, error: data.error });
      } else {
        setValue({
          ...value,
          name: data.name,
        });
      }
    });
  };

  useEffect(() => {
    preLoad(match.params.categoryId);
  }, []);

  const handleChange = (event) => {
    setValue({
      ...value,
      name: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    // console.log(match.params.categoryId, user._id, token, name);
    updateCategory(match.params.categoryId, user._id, token, { name }).then(
      (data) => {
        if (data.error) {
          setValue({
            error: data.error,
            success: "",
          });
        } else {
          setValue({
            name: "",
            error: "",
            success: true,
          });
        }
      }
    );
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Categoy updated successfully</h4>;
    }
  };

  const warningMessage = () => {
    if (error) {
      return <h4 className="text-danger">Failed to update category</h4>;
    }
  };

  const updateCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="lead"> Enter The New Category Name</p>
        <input
          type="text"
          className="form-control my-3"
          onChange={handleChange}
          value={name}
          autoFocus
          required
          placeholder="For ex. Summer"
        />
        <button onClick={onSubmit} className="btn btn-outline-info">
          Update Category
        </button>
      </div>
    </form>
  );

  return (
    <div>
      <Base
        title="Update Category"
        description="Update anything related to category here"
        className="container bg-info p-4"
      >
        <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
          Cancel
        </Link>
        <div className="row bg-dark text-white rounded">
          <div className="col-md-8 offset-md-2">
            {successMessage()}
            {warningMessage()}
            {updateCategoryForm()}
          </div>
        </div>
      </Base>
    </div>
  );
};

export default UpdateCategory;
