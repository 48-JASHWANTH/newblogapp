import React from "react";
import "./NewArticle.css";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosWithToken } from "../../axiosWithToken";

function NewArticle() {
  let { register, handleSubmit } = useForm();
  let { currentUser } = useSelector((state) => state.userAuthorLoginReducer);
  let [err, setErr] = useState("");
  let navigate = useNavigate();
  let token = localStorage.getItem("token");

  const postNewArticle = async (article) => {
    article.dateOfCreation = new Date();
    article.dateOfModification = new Date();
    article.articleId = Date.now();
    article.userName = currentUser.userName;
    article.comments = [];
    article.status = true;
    console.log(article);
    //make HTTP post request
    let res = await axiosWithToken.post(
      "http://localhost:4000/authorApi/writeArticle",
      article
    );
    //console.log(res)

    if (res.data.message === "new article is created") {
      navigate(`/AuthorProfile/articlesByAuthor/${currentUser.userName}`);
    } else {
      setErr(res.data.message);
    }
  };

  return (
    <div className="newArticle-body">
      <div className="newArticle-container">
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8 col-md-8 col-sm-10">
            <div className="card shadow">
              <div className="card-title text-center border-bottom">
                <h2 className="p-3">Write an Article</h2>
              </div>
              
              <div className="card-body bg-light">
                <form onSubmit={handleSubmit(postNewArticle)}>
                 {/* Title */}
                  <div className="mb-4">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      {...register("title")}
                    />
                  </div>

                  {/* Select a category */}
                  <div className="mb-4">
                    <label htmlFor="category" className="form-label">
                      Select a category
                    </label>
                    <select
                      {...register("category")}
                      id="category"
                      className="form-select"
                    >
                      <option value="programming">Programming</option>
                      <option value="AI&ML">AI&ML</option>
                      <option value="dataBase">DataBase</option>
                    </select>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <label htmlFor="content" className="form-label">
                      Content
                    </label>
                    <textarea
                      {...register("content")}
                      className="form-control"
                      id="content"
                      rows="10"
                    ></textarea>
                  </div>

                  {/* button */}
                  <button className="btn btn-success">POST</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewArticle;
