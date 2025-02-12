import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "../App";
import { Login, LayoutMenu, Home, Settings, ProtectedAuth, ProtectedLayout} from "@pages";

const Index = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<ProtectedAuth><Login /></ProtectedAuth>} />
        <Route path="layout/*" element={<ProtectedLayout><LayoutMenu/></ProtectedLayout> }>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default Index;
