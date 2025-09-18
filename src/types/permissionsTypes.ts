

export interface Permission {
  id: number;
  name: string;
  action?: string;
}

export type Model = {
  id: number;
  name: string;
  permissions: Permission[];
};

export type DataResponse = {
  data: {
    models: Model[];
  };
  message: string;
  status: number;
};

export interface PermissionListItem {
    id: number;
    name: string;
    permissions: Permission[];
}