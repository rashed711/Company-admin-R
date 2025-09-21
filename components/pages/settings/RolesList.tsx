
import React, { useState } from 'react';
import { useTranslation } from '../../../services/localization';
import { ROLES } from '../../../contexts/AuthContext';
import { PERMISSION_STRUCTURE, Permission, Role } from '../../../types';
import Button from '../../ui/Button';

type Scope = 'own' | 'team' | 'all';
type Action = 'view' | 'edit' | 'delete';

const RolesList = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Record<string, Role>>(ROLES);

  const handleScopeChange = (roleId: string, group: string, module: string, action: Action, scope: Scope | null) => {
    setRoles(prevRoles => {
      const updatedRole = { ...prevRoles[roleId] };
      
      // Filter out all permissions related to this action for this module
      let newPermissions = updatedRole.permissions.filter(p => !p.startsWith(`${group}:${module}:${action}`));
      
      // If a scope is selected (not null), add the new permission
      if (scope) {
        newPermissions.push(`${group}:${module}:${action}${scope === 'own' ? '' : `_${scope}`}` as Permission);
      }
      
      updatedRole.permissions = newPermissions;
      return { ...prevRoles, [roleId]: updatedRole };
    });
  };

  const handlePermissionToggle = (roleId: string, permission: Permission, isChecked: boolean) => {
    setRoles(prevRoles => {
      const updatedRole = { ...prevRoles[roleId] };
      const currentPermissions = new Set(updatedRole.permissions);
      if (isChecked) {
        currentPermissions.add(permission);
      } else {
        currentPermissions.delete(permission);
      }
      updatedRole.permissions = Array.from(currentPermissions);
      return { ...prevRoles, [roleId]: updatedRole };
    });
  };
  
  const getScopeForAction = (role: Role, group: string, module: string, action: Action): Scope | null => {
    if (role.permissions.includes(`${group}:${module}:${action}_all` as Permission)) return 'all';
    if (role.permissions.includes(`${group}:${module}:${action}_team` as Permission)) return 'team';
    if (role.permissions.includes(`${group}:${module}:${action}` as Permission)) return 'own';
    return null;
  };

  const handleSaveChanges = (roleId: string) => {
    // In a real app, you would make an API call here to save the changes.
    alert(`Changes for role '${roles[roleId].name}' saved!`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('role_management')}</h1>
      </div>
      
      <div className="space-y-8">
        {Object.values(roles).map(role => (
          <div key={role.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-3 mb-4">
              <h3 className="text-2xl font-bold text-sky-600 dark:text-sky-400">{role.name}</h3>
              {role.id !== 'admin' && <Button variant="primary" onClick={() => handleSaveChanges(role.id)}>{t('save_changes')}</Button>}
            </div>
            
            <div className="space-y-6">
              {Object.values(PERMISSION_STRUCTURE).map(group => (
                <div key={group.id}>
                  <h4 className="text-lg font-semibold mb-3">{t(group.title)}</h4>
                  
                  {'permissions' in group && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(group.permissions).map(([key, transKey]) => {
                        const permission = `${group.id}:${key}` as Permission;
                        return (
                          <div key={permission} className="flex items-center">
                            <input 
                              type="checkbox" 
                              id={`${role.id}-${permission}`}
                              className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500"
                              checked={role.permissions.includes(permission)}
                              onChange={(e) => handlePermissionToggle(role.id, permission, e.target.checked)}
                              disabled={role.id === 'admin'}
                            />
                            <label htmlFor={`${role.id}-${permission}`} className="ms-2 text-sm text-gray-900 dark:text-gray-300">
                              {t(transKey)}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {'modules' in group && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-start text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th className="px-4 py-2">{t('module')}</th>
                            <th className="px-4 py-2 text-center">{t('permission_action_view')}</th>
                            <th className="px-4 py-2 text-center">{t('permission_action_edit')}</th>
                            <th className="px-4 py-2 text-center">{t('permission_action_delete')}</th>
                            <th className="px-4 py-2 text-center">{t('other_permissions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(group.modules).map(([modKey, modDef]) => {
                            const hasScopedActions = modDef.actions.some(a => a.startsWith('view') || a.startsWith('edit') || a.startsWith('delete'));
                            const otherActions = modDef.actions.filter(a => !['view', 'edit', 'delete', 'view_team', 'view_all', 'edit_team', 'edit_all', 'delete_team', 'delete_all'].includes(a));
                            
                            return (
                              <tr key={modKey} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-4 py-2 font-medium">{t(modDef.title)}</td>
                                
                                {(['view', 'edit', 'delete'] as Action[]).map(action => (
                                  <td key={action} className="px-4 py-2 text-center">
                                    {modDef.actions.includes(action) ? (
                                      <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse text-xs">
                                        {(['own', 'team', 'all'] as Scope[]).map(scope => {
                                          const permissionString = `${action}${scope === 'own' ? '' : `_${scope}`}`;
                                          if (!modDef.actions.includes(permissionString)) return null;
                                          return (
                                            <div key={scope} className="flex items-center">
                                              <input
                                                type="radio"
                                                id={`${role.id}-${group.id}-${modKey}-${action}-${scope}`}
                                                name={`${role.id}-${group.id}-${modKey}-${action}`}
                                                checked={getScopeForAction(role, group.id, modKey, action) === scope}
                                                onChange={() => handleScopeChange(role.id, group.id, modKey, action, scope)}
                                                disabled={role.id === 'admin'}
                                                className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 focus:ring-sky-500"
                                              />
                                              <label htmlFor={`${role.id}-${group.id}-${modKey}-${action}-${scope}`} className="ms-1">{t(`permission_scope_${scope}`)}</label>
                                            </div>
                                          )
                                        })}
                                         <button onClick={() => handleScopeChange(role.id, group.id, modKey, action, null)} className="text-red-500 text-lg" title={t('permission_scope_none')}>&times;</button>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                ))}

                                <td className="px-4 py-2 text-center">
                                  <div className="flex justify-center items-center space-x-3 rtl:space-x-reverse flex-wrap">
                                  {otherActions.length > 0 ? otherActions.map(action => {
                                    const permission = `${group.id}:${modKey}:${action}` as Permission;
                                    return (
                                      <div key={action} className="flex items-center">
                                        <input
                                          type="checkbox"
                                          id={`${role.id}-${permission}`}
                                          checked={role.permissions.includes(permission)}
                                          onChange={(e) => handlePermissionToggle(role.id, permission, e.target.checked)}
                                          disabled={role.id === 'admin'}
                                          className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500"
                                        />
                                        <label htmlFor={`${role.id}-${permission}`} className="ms-1 text-xs">{t(`permission_action_${action}` as any)}</label>
                                      </div>
                                    )
                                  }) : <span className="text-gray-400">-</span>}
                                  </div>
                                </td>

                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesList;
