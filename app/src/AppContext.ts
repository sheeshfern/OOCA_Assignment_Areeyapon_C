import { createContext, useContext, type Dispatch, type MouseEvent } from 'react';
import type { Copy } from './data/ui';
import type { Action, Screen, State } from './state';

export interface AppApi {
  s: State;
  dispatch: Dispatch<Action>;
  /** interface copy in the current language */
  L: Copy;
  go: (screen: Screen) => void;
  /** a tapped choice: plays its reaction, then dispatches */
  tap: (e: MouseEvent<HTMLElement>, action: Action) => void;
  openNote: () => void;
  /** the one-minute exercise on the result card */
  openEx: () => void;
  /** the mock Google sign-in sheet */
  /** `then` is where to go once signed in (the chat waits behind the sign-in) */
  openLogin: (then?: Screen) => void;
  saveCard: (btn: HTMLButtonElement) => void;
}

export const AppContext = createContext<AppApi | null>(null);

export function useApp(): AppApi {
  const api = useContext(AppContext);
  if (!api) throw new Error('useApp outside <AppContext>');
  return api;
}
