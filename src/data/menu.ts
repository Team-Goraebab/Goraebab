import { FaBox, FaImages, FaNetworkWired, FaDatabase } from 'react-icons/fa';
import { FiSettings, FiGrid, FiBell, FiCpu, FiTool } from 'react-icons/fi';

{
  /* 메뉴의 id 값을 통해 sidebar를 랜더링합니다. */
}

export const MENU_ITEMS = [
  { id: 1, name: 'Container', path: '/', icon: FaBox },
  { id: 2, name: 'Image', path: '/', icon: FaImages },
  { id: 3, name: 'Network', path: '/', icon: FaNetworkWired },
  { id: 4, name: 'Volume', path: '/', icon: FaDatabase },
];

export const SETTINGS_MENU = [
  { id: 1, label: 'General', icon: FiSettings },
  { id: 2, label: 'Resources', icon: FiCpu },
  { id: 3, label: 'Docker Engine', icon: FiGrid },
  { id: 4, label: 'Builders', icon: FiTool },
  { id: 5, label: 'Kubernetes', icon: FiTool },
  { id: 6, label: 'Software updates', icon: FiBell },
  { id: 7, label: 'Extensions', icon: FiTool },
  { id: 8, label: 'Features in development', icon: FiTool },
  { id: 9, label: 'Notifications', icon: FiBell },
  { id: 10, label: 'Advanced', icon: FiTool },
];
