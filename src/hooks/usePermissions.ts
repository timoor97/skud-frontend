import { useMemo } from 'react';

interface Permission {
  action: string;
}

interface UsePermissionsReturn {
  hasPermission: (action: string) => boolean;
  hasAllPermissions: (actions: string[]) => boolean;
  isAdmin: boolean;
  permissionsMap: Record<string, boolean>;
}

const usePermissions = (userPermissions: Permission[], userRole: string = 'Super Admin'): UsePermissionsReturn => {
  const permissionsMap = useMemo<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    userPermissions.forEach((permission: Permission) => {
      map[permission.action] = true;
    });
    return map;
  }, [userPermissions]);

  const hasPermission = (action: string): boolean => {
    return !!permissionsMap[action];
  };

  const hasAllPermissions = (actions: string[]): boolean => {
    return actions.every(action => hasPermission(action));
  };

  const isAdmin = useMemo(() => (userRole === 'Супер Админ' || userRole === 'Super Admin'), [userRole]);

  return {
    hasPermission,
    hasAllPermissions,
    permissionsMap,
    isAdmin
  };
};

export default usePermissions;
