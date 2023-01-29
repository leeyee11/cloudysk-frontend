import { useState } from 'react';

export const enum LayoutTypes {
  Grid = 'Grid',
  List = 'List',
}
const useFileLayout = () => {
  const [layout, setLayout] = useState<LayoutTypes>(LayoutTypes.Grid);
  const switchLayout = () => {
    setLayout((layout) =>
      layout === LayoutTypes.Grid ? LayoutTypes.List : LayoutTypes.Grid,
    );
  };
  return { layout, switchLayout };
};

export default useFileLayout;
