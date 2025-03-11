import { lazy } from 'react';
import { ProtectedAuth } from './protect-route';
import { ProtectedLayout } from './protect-route';
const Login = lazy(() => import('./login'));
const LayoutMenu = lazy(() => import('./layout-menu'));
const Dashboard = lazy(() => import('./dashboard'));
const Role = lazy(() => import('./role'));
const User = lazy(() => import('./user'));
const Teams = lazy(() => import('./teams'));
const TeamMembers = lazy(() => import('./team-members'));
const Profile = lazy(() => import('./profile'));
const KpiEstablish = lazy(() => import('./kpi-establish'));
const Division = lazy(() => import('./establish-process'));
const TableEstablishment = lazy(() => import('./table-establishment'));
const EstablishProgress = lazy(() => import('./establish-progress'));
const TeamProgress = lazy(() => import('./teams/team-progress'));
export {Login,LayoutMenu, Dashboard, ProtectedAuth, ProtectedLayout, Role, User, Teams, TeamMembers, Profile, KpiEstablish, Division, TableEstablishment, EstablishProgress,TeamProgress}