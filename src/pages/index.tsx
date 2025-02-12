import { lazy } from 'react';
import { ProtectedAuth } from './protect-route';
import { ProtectedLayout } from './protect-route';
const Login = lazy(() => import('./login'));
const LayoutMenu = lazy(() => import('./layout-menu'));
const Home = lazy(() => import('./home'));
const Settings = lazy(() => import('./settings'));
export {Login,LayoutMenu, Home, Settings, ProtectedAuth, ProtectedLayout}