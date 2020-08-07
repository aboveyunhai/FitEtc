import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const isMountedRef = createRef();
export const navigationRef = createRef<NavigationContainerRef>();

export function navigate(name:string, params: any) {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
  }
}

export function getCurrentRoute() {
  if(navigationRef.current === null) return;
  let rootState = navigationRef.current.getRootState();
  let route = rootState.routes[rootState.index];
  let currentRoute;

  while (route.state) {
    route = route.state.routes[route.state.index];
  }
  
  return route;
}
