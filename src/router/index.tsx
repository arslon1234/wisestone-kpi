import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "../App";
import { Login, Role, User, LayoutMenu, Home, ProtectedAuth, ProtectedLayout} from "@pages";
const Index = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<ProtectedAuth><Login /></ProtectedAuth>} />
        <Route path="layout/*" element={<ProtectedLayout><LayoutMenu/></ProtectedLayout> }>
          <Route index element={<Home />} />
          <Route path="role" element={<Role />} />
          <Route path="user" element={<User />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default Index;
