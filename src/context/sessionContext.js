import { createContext, useContext } from "react";

export const TokenContext = createContext({ token: "", tokenLoading: false });

export const TokenContextProvider = TokenContext.Provider;

export function useToken() {
  return useContext(TokenContext);
}
