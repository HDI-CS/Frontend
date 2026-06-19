'use client';

import { createContext, useCallback, useContext, useRef } from 'react';

interface DirtyGuardContextType {
  setIsDirty: (value: boolean) => void;
  getIsDirty: () => boolean;
}

const DirtyGuardContext = createContext<DirtyGuardContextType>({
  setIsDirty: () => {},
  getIsDirty: () => false,
});

export function DirtyGuardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDirtyRef = useRef(false);

  const setIsDirty = useCallback((value: boolean) => {
    isDirtyRef.current = value;
  }, []);

  const getIsDirty = useCallback(() => isDirtyRef.current, []);

  return (
    <DirtyGuardContext.Provider value={{ setIsDirty, getIsDirty }}>
      {children}
    </DirtyGuardContext.Provider>
  );
}

export const useDirtyGuardContext = () => useContext(DirtyGuardContext);
