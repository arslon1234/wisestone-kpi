import { lazy } from 'react';
import { ProtectedAuth } from './protect-route';
import { ProtectedLayout } from './protect-route';
const Login = lazy(() => import('./login'));
const LayoutMenu = lazy(() => import('./layout-menu'));
const Dashboard = lazy(() => import('./dashboard'));
const Role = lazy(() => import('./role'));
const User = lazy(() => import('./user'));
const Teams = lazy(() => import('./teams'));
const TeamMembers = lazy(() => import('./team-members/index'));
const UserTeamMembers = lazy(() => import('./team-members/members'));
const Profile = lazy(() => import('./profile'));
const TeamProgress = lazy(() => import('./teams/team-progress'));
const YearlyKPI = lazy(() => import('./yearly-kpi/index'));
const MonthlyKPI = lazy(() => import('./monthly-kpi/index'));
const Approved = lazy(() => import('./approved/index'));
export {Login,LayoutMenu, Dashboard, ProtectedAuth, ProtectedLayout, Role, User, Teams, TeamMembers, Profile,TeamProgress, UserTeamMembers, YearlyKPI, MonthlyKPI, Approved}