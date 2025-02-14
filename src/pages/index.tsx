import { lazy } from 'react';
import { ProtectedAuth } from './protect-route';
import { ProtectedLayout } from './protect-route';
const Login = lazy(() => import('./login'));
const LayoutMenu = lazy(() => import('./layout-menu'));
const Home = lazy(() => import('./home'));
const Role = lazy(() => import('./role'));
const User = lazy(() => import('./user'));
const Teams = lazy(() => import('./teams'));
export {Login,LayoutMenu, Home, ProtectedAuth, ProtectedLayout, Role, User,Teams}