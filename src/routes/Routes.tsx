import type { Page } from '@cutting/util';
import type { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Sine } from 'src/components/Sine/Sine';

export const pages: Page[] = [
  {
    heading: 'Sine Wave',
    path: '/',
    component: Sine,
    exact: true,
  },
];

export const Routes: FC = () => (
  <Switch>
    {pages.map(({ path, ...rest }) => (
      <Route key={path} {...rest} />
    ))}
  </Switch>
);
