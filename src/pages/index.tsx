import { lazy } from 'react';

const Login = lazy(() => import('./login'));
const LayoutMenu = lazy(() => import('./layout-menu'));
const Home = lazy(() => import('./home'));
const Settings = lazy(() => import('./settings'));

export {Login,LayoutMenu, Home, Settings}