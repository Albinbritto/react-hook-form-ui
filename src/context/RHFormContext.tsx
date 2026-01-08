import { createContext, useContext } from 'react';
import { RHFormContextType, RHFormProviderProps } from '../type';

const RHFormContext = createContext<RHFormContextType | undefined>(undefined);

export const RHFormProvider = ({ showAsterisk, children }: RHFormProviderProps) => {
  return <RHFormContext.Provider value={{ showAsterisk }}>{children}</RHFormContext.Provider>;
};

export const useRHFormContext = () => {
  const context = useContext(RHFormContext);

  if (!context) {
    throw new Error('useRHFormContext must be used within a RHFormProvider');
  }

  return context;
};

export default RHFormContext;
