import React from "react";
import "./Articles.css";
import { axiosWithToken } from "../../axiosWithToken";
import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

function Articles() {
  const [articlesList, setArticlesList] = useState([]);
  const navigate = useNavigate();

  const getArticlesOfCurrentAuthor = async () => {
    let res = await axiosWithToken.get(
      "http://localhost:4000/userApi/viewArticles"
    );
    //console.log(currentUser)
    //console.log(res);
    setArticlesList(res.data.payload);
  };

  const readArticleByArticleId = (articleObj) => {
    navigate(`../article/${articleObj.articleId}`, { state: articleObj });
  };

  useEffect(() => {
    getArticlesOfCurrentAuthor();
  }, []);

  function ISOtoUTC(iso) {
    let date = new Date(iso).getUTCDate();
    let day = new Date(iso).getUTCDay();
    let year = new Date(iso).getUTCFullYear();
    return `${date}/${day}/${year}`;
  }

  return (
    <div className="abody">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
        {articlesList.map((article) => (
          <div className="col" key={article.articleId}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">
                  {article.content
                    ? article.content.substring(0, 80) + "...."
                    : ""}
                </p>

                {/* button */}
                <button
                  className="cssbuttons-io-button"
                  onClick={() => readArticleByArticleId(article)}
                >
                  Read more
                  <div className="icon">
                    <svg
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path
                        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
              <div className="card-footer">
                <small className="text-body-secondary">
                  Last updated on {ISOtoUTC(article.dateOfModification)}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;
