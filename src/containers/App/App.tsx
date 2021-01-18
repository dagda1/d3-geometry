import { FC } from 'react';
import { Router } from 'react-router-dom';
import { Routes } from 'src/routes/Routes';
import { createBrowserHistory } from 'history';

import './global.module.scss';

const history = createBrowserHistory();

export const App: FC = () => {
  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
};
