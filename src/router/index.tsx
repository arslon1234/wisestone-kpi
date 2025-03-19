import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "../App";
import { Login, Role, User, LayoutMenu, Dashboard, ProtectedAuth, ProtectedLayout, Teams, TeamMembers, Profile, KpiEstablish, Division, TableEstablishment,EstablishProgress, TeamProgress, UserTeamMembers} from "@pages";
const Index = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<ProtectedAuth><Login /></ProtectedAuth>} />
        <Route path="layout/*" element={<ProtectedLayout><LayoutMenu/></ProtectedLayout> }>
          <Route index element={<Dashboard />} />
          <Route path="yearly-kpi" element={<KpiEstablish />} />
          <Route path="yearly-kpi/:id" element={<Division />} />
          <Route path="yearly-kpis/:id" element={<TableEstablishment />} />
          <Route path="establish-progress" element={<EstablishProgress />} />
          <Route path="role" element={<Role />} />
          <Route path="user" element={<User />} />
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
