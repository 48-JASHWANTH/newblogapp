import React from "react";
import "./Article.css";
import { Navigate, useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { axiosWithToken } from "../../axiosWithToken";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FcCalendar } from "react-icons/fc";
import { FcClock } from "react-icons/fc";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { BiCommentAdd } from "react-icons/bi";
import { FcPortraitMode } from "react-icons/fc";
import { FcComments } from "react-icons/fc";
import { MdRestore } from "react-icons/md";

function Article() {
  const { state } = useLocation();
  let { register, handleSubmit } = useForm();
  let { currentUser } = useSelector((state) => state.userAuthorLoginReducer);
  let [comment, setComment] = useState("");
  let [articleEditStatus, setArticleEditStatus] = useState(false);
  let [currentArticle, setCurrentArticle] = useState(state);

  //soft delete article
  const deleteArticle = async () => {
    let art = { ...currentArticle };
    delete art._id;
    let res = await axiosWithToken.put(
      `http://localhost:4000/authorApi/deleteArticle/${currentArticle.articleId}`,
      art
    );
    if (res.data.message === "Article removed") {
      setCurrentArticle({ ...currentArticle, status: res.data.payload });
    }
  };

  //restore article
  const restoreArticle = async () => {
    let art = { ...currentArticle };
    delete art._id;
    let res = await axiosWithToken.put(
      `http://localhost:4000/authorApi/deleteArticle/${currentArticle.articleId}`,
      art
    );
    if (res.data.message === "article restored") {
      setCurrentArticle({ ...currentArticle, status: res.data.payload });
    }
  };

  //add comment to an article by user
  const writeComment = async (commentObj) => {
    commentObj.userName = currentUser.userName;
    //console.log(commentObj)
    let res = await axiosWithToken.post(
      `http://localhost:4000/userApi/comment/${state.articleId}`,
      commentObj
    );
    if (res.data.message === "Comment posted successfully") {
      setComment(res.data.message);
    }
  };

  //enable edit status
  const enableEditState = () => {
    setArticleEditStatus(true);
  };

  //disable edit status
  const saveModifiedArticle = async (editedArticle) => {
    let modifiedArticle = { ...state, ...editedArticle };
    modifiedArticle.dateOfModification = new Date();
    delete modifiedArticle._id;

    //make HTTP put req to save modified article
    let res = await axiosWithToken.put(
      "http://localhost:4000/authorApi/modifyArticle",
      modifiedArticle
    );

    if (res.data.message === "article has been modified") {
      setArticleEditStatus(false);
      Navigate(`/authorProfile/article/${modifiedArticle.articleId}`, {
        state: res.data.article,
      });
    }
  };

  //convert ISO date to UTC data
  function ISOtoUTC(iso) {
    let date = new Date(iso).getUTCDate();
    let day = new Date(iso).getUTCDay();
    let year = new Date(iso).getUTCFullYear();
    return `${date}/${day}/${year}`;
  }

  return (
    <div>
      <div className="article-body">
        {articleEditStatus === false ? (
          <>
            <div className="d-flex justify-content-between">
              <div>
                <p className="display-3 me-4">{state.title}</p>
                <span className="py-3">
                  <small className=" text-secondary me-4">
                    {/* <FcCalendar className="fs-4" /> */}
                    <FcCalendar className="fs-4" />
                    Created on:{ISOtoUTC(state.dateOfCreation)}
                  </small>
                  <small className=" text-secondary">
                    {/* <FcClock className="fs-4" /> */}
                    <FcClock className="fs-4" />
                    Modified on: {ISOtoUTC(state.dateOfModification)}
                  </small>
                </span>
              </div>

              <div>
                {currentUser.userType === "author" && (
                  <>
                    <button
                      className="me-2 btn btn-warning"
                      onClick={enableEditState}
                    >
                      <CiEdit className="fs-2" />
                    </button>
                    {currentArticle.status === true ? (
                      <button
                        className="me-2 btn btn-danger"
                        onClick={deleteArticle}
                      >
                        <MdDelete className="fs-2" />
                      </button>
                    ) : (
                      <button
                        className="me-2 btn btn-info"
                        onClick={restoreArticle}
                      >
                        <MdRestore className="fs-2" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <p className="lead mt-4" style={{ whiteSpace: "pre-line" }}>
              {state.content}
            </p>

            {/* user comments */}
            <div>
              {/* read existing comments */}
              <div className="comments my-4">
                {state.comments.length === 0 ? (
                  <p className="display-5">No comments yet...</p>
                ) : (
                  <>
                    <h2 className="display-5">Comments</h2>
                    {state.comments.map((commentObj, ind) => {
                      return (
                        <div key={ind} className="bg-light p-3">
                          <p
                            className="fs-4"
                            style={{
                              color: "dodgerblue",
                              textTransform: "capitalize",
                            }}
                          >
                            <FcPortraitMode className="fs-2 me-2" />
                            {commentObj.userName}
                          </p>

                          <p
                            style={{
                              fontFamily: "fantasy",
                              color: "lightseagreen",
                            }}
                            className="ps-4"
                          >
                            <FcComments className="me-2" />
                            {commentObj.comment}
                          </p>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            <h1>{comment}</h1>
            {/* Write comment by user */}
            {currentUser.userType === "user" && (
              <form onSubmit={handleSubmit(writeComment)}>
                <input
                  type="text"
                  {...register("comment")}
                  className="form-control mb-4"
                  placeholder="Write comment here"
                />
                <button className="btn btn-success">
                  Add comment <BiCommentAdd className="fs-3" />
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="edit-body">
            <div className="edit-container">
              <div className="row justify-content-center mt-5">
                <div className="col-lg-8 col-md-8 col-sm-10">
                  <div className="card shadow"></div>
                  <div className="card-title text-center border-bottom">
                    <h2 className="p-3">Update your Article</h2>
                  </div>
                  <div className="card-body bg-light">
                    <form onSubmit={handleSubmit(saveModifiedArticle)}>
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
                          defaultValue={state.title}
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
                          defaultValue={state.category}
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
                          defaultValue={state.content}
                        ></textarea>
                      </div>

                      {/* button */}
                      <button className="btn btn-success">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Article;
