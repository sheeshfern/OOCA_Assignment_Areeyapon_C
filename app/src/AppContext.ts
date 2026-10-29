import { createContext, useContext, type Dispatch } from 'react';
import type { Copy } from './data/ui';
import type { Action, Screen, State } from './state';

export interface AppApi {
  s: State;
  dispatch: Dispatch<Action>;
  /** interface copy in the current language */
  L: Copy;
  go: (screen: Screen) => void;
  openNote: () => void;
  saveCard: (btn: HTMLButtonElement) => void;
}

export const AppContext = createContext<AppApi | null>(null);

export function useApp(): AppApi {
  const api = useContext(AppContext);
  if (!api) throw new Error('useApp outside <AppContext>');
  return api;
}
