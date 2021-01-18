import { FC, useRef } from 'react';
import { ResponsiveSVG } from '@cutting/svg';
import { useParentSize } from '@cutting/hooks';

import styles from './sine.module.scss';

export const Sine: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useParentSize(ref);

  return (
    <div className={styles.container} ref={ref}>
      <ResponsiveSVG height={height} width={width}>
        <rect
          x="20%"
          y="20%"
          width={height / 2}
          height={height / 2}
          rx="20"
          style={{ fill: '#ff0000', stroke: '#000000', strokeWidth: '2px' }}
        />

        <rect
          x="30%"
          y="30%"
          width={height / 2}
          height={height / 2}
          rx="40"
          style={{ fill: '#0000ff', stroke: '#000000', strokeWidth: '2px', fillOpacity: 0.7 }}
        />
      </ResponsiveSVG>
    </div>
  );
};
