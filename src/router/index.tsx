import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "../App";
import { Login, Role, User, LayoutMenu, Dashboard, YearlyKPI, Approved, ProtectedAuth,MonthlyKPI, ProtectedLayout, Teams, TeamMembers, Profile, TeamProgress, UserTeamMembers} from "@pages";
const Index = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<ProtectedAuth><Login /></ProtectedAuth>} />
        <Route path="layout/*" element={<ProtectedLayout><LayoutMenu/></ProtectedLayout> }>
          <Route index element={<Dashboard />} />
          <Route path="role" element={<Role />} />
          <Route path="user" element={<User />} />
          <Route path="yearly-kpi" element={<YearlyKPI />} />
          <Route path="monthly-kpi" element={<MonthlyKPI />} />
          <Route path="approved" element={<Approved />} />
          <Route path="team" element={<Teams />} />
          <Route path="team-progress/:id" element={<TeamProgress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="team/:id" element={<TeamMembers />} />
          <Route path="team-members" element={<UserTeamMembers />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default Index;
