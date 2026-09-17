// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";

// ** Utils
import { isObjEmpty } from "@utils";
import ProtectedRoute from "../ProtectedRoutes";
const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/login";
const Home = lazy(() => import("../../views/Home"));
const SecondPage = lazy(() => import("../../views/SecondPage"));
const Login = lazy(() => import("../../views/Login"));
const Register = lazy(() => import("../../views/Register"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));
const Error = lazy(() => import("../../views/Error"));
const BlogList = lazy(() => import('../../views/blog/list'))
const BlogAdd = lazy(() => import('../../views/blog/add'))
const BlogEdit = lazy(() => import('../../views/blog/edit'))
const BlogEditPost = lazy(() => import('../../views/blog/edit/EditPost'))
const BlogDetails = lazy(() => import('../../views/blog/details'))
const Export = lazy(() => import('../../navigation/vertical/Export'))
const Import = lazy(() => import('../../navigation/vertical/Import'))

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  {
    path: "/home",
    element: <ProtectedRoute element={<Home/>} permissions={['admin', 'editor', 'creator']}></ProtectedRoute>,
  },
  {
    path: "/second-page",
    element: <ProtectedRoute element={<SecondPage />} permissions={['admin', 'editor', 'creator']}> </ProtectedRoute>,
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/register",
    element: <Register/>,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword/>,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: '/pages/blog/list',
    element: <ProtectedRoute element={<BlogList/>} permissions={['admin']}> </ProtectedRoute>,
  },
  {
    path: '/pages/blog/detail/:id',
    element: <ProtectedRoute element={<BlogDetails/>} permissions={['admin']}> </ProtectedRoute>,
  },
  {
    path: '/pages/blog/Add-a-post',
    element: <ProtectedRoute element={<BlogAdd/>} permissions={['admin','creator']}> </ProtectedRoute>,
  },
  {
    path: '/pages/blog/edit-a-post/:id',
    element: <ProtectedRoute element={<BlogEditPost/>} permissions={['admin', 'editor']}> </ProtectedRoute>,
  },
  {
    path: '/pages/blog/edit',
    element: <ProtectedRoute element={<BlogEdit/>} permissions={['admin', 'editor']}> </ProtectedRoute>,
  },

  {
    path: "/export",
    index: true,
    element: <ProtectedRoute element={<Export/>} permissions={['admin']}> </ProtectedRoute>,
  },

  {
    path: "/import",
    index: true,
    element: <ProtectedRoute element={<Import/>} permissions={['admin']}> </ProtectedRoute>,
  },


];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
