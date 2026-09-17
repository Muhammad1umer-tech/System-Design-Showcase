// ** Router imports
import { useRoutes } from "react-router-dom";

// ** GetRoutes
import { getRoutes } from "./routes";

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout";

import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux'

const Router = () => {
  // const isAuthenticated = useSelector((state) => state.counter.isAuthenticated);
  // const userPermissions = useSelector((state) => state.counter.userPermissions)
  const isAuthenticated = true
  const userPermissions = ['admin']
  const { layout } = useLayout();

  const allRoutes = getRoutes(layout);

  const protectedRoutes = allRoutes.map(route => {
    // Check if the route has children
    if (route.children && route.children.length > 0) {
      // If the route has children, map over them and apply permissions check
      const modifiedChildren = route.children.map(childRoute => {
        if (childRoute.permissions && childRoute.permissions.length > 0) {
          return {
            ...childRoute,
            element: isAuthenticated && userPermissions.some(permission => childRoute.permissions.includes(permission)) ? childRoute.element : <Navigate to="/error" />,
          };
        } else {
          return childRoute;
        }
      });
      // Return the modified children for the current route
      return {
        ...route,
        children: modifiedChildren,
      };
    } else {
      // If the route has no children, apply permissions check directly to the route
      if (route.permissions && route.permissions.length > 0) {
        return {
          ...route,
          element: isAuthenticated && userPermissions.some(permission => route.permissions.includes(permission)) ? route.element : <Navigate to="/login" />,
        };
      } else {
        return route;
      }
    }
  });
  
  
    const routes = useRoutes([...allRoutes]);
  

    return routes;
};

export default Router;
