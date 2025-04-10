declare module "*.svg" {
    import { FC } from 'react';
    const ReactComponent: FC<React.SVGProps<SVGSVGElement>>;
    export { ReactComponent };
  }
  