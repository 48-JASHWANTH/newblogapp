import "./App.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import RootLayout from "./components/rootLayout/RootLayout";
import Home from "./components/home/Home";
import SignUp from "./components/signUp/SignUp";
import SignIn from "./components/signIn/SignIn";
import UserProfile from "./components/userProfile/UserProfile"
import AuthorProfile from "./components/authorProfile/AuthorProfile"
import Articles from "./components/articles/Articles"
import Article from "./components/article/Article"
import NewArticle from "./components/newArticle/NewArticle";
import ArticlesByAuthor from './components/articlesByAuthor/ArticlesByAuthor'
import ErrorPage  from "./components/ErrorPage";



function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <RootLayout></RootLayout>,
      errorElement:<ErrorPage></ErrorPage>,
      children: [
        {
          path: "",
          element: <Home></Home>,
        },
        {
          path: "SignUp",
          element: <SignUp></SignUp>,
        },
        {
          path: "SignIn",
          element: <SignIn></SignIn>,
        },
        {
          path: "UserProfile",
          element:<UserProfile></UserProfile>,
          children:[
            {
              path:'articles',
              element:<Articles></Articles>
            },
            {
              path:'article/:articleId',
              element:<Article></Article>
            },
            {
              path:'',
              element:<Navigate to='articles'/>
            }
          ]
        },
        {
          path:"AuthorProfile",
          element:<AuthorProfile></AuthorProfile>,
          children:[
            {
              path:'newArticle',
              element:<NewArticle></NewArticle>
            },
            {
              path:'articlesByAuthor/:author',
              element:<ArticlesByAuthor></ArticlesByAuthor>
            },
            {
              path:'article/:articleId',
              element:<Article></Article>
            },
            {
              path:'',
              element:<Navigate to = 'articlesByAuthor/:author'/>
            }
          ]
        }
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
