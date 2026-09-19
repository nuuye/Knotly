import { ArrowLeft, Check, Palette, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { useState } from "react";
import { COMMUNITY_PERMISSIONS } from "../../../data/permissions";
import type { PermissionKey, RolesPermissionsDialogProps } from "../../../types/home";
import styles from "../../../routes/home.module.scss";

const ROLE_COLORS = ["#e85d04", "#f6b64f", "#d97465", "#78937c", "#8b668c"];

/** Creates roles and controls what each role can do inside one community. */
export function RolesPermissionsDialog({ communityName, roles, onBack, onClose, onCreateRole, onDeleteRole, onUpdateRole }: RolesPermissionsDialogProps) {
    const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id ?? "");
    const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0];

    const createRole = () => {
        setSelectedRoleId(onCreateRole());
    };

    const togglePermission = (permission: PermissionKey) => {
        if (!selectedRole || selectedRole.id === "owner") return;
        const permissions = selectedRole.permissions.includes(permission)
            ? selectedRole.permissions.filter((item) => item !== permission)
            : [...selectedRole.permissions, permission];
        onUpdateRole(selectedRole.id, { permissions });
    };

    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <section className={`${styles.newMessageModal} ${styles.rolesModal}`} role="dialog" aria-modal="true" aria-labelledby="roles-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div className={styles.rolesDialogTitle}><button type="button" onClick={onBack} aria-label="Back to community settings"><ArrowLeft /></button><div><span>{communityName}</span><h2 id="roles-title">Roles & permissions</h2></div></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>

                <div className={styles.rolesWorkspace}>
                    <aside className={styles.rolesList}>
                        <div><span>Community roles</span><button type="button" onClick={createRole} aria-label="Create a role"><Plus /></button></div>
                        {roles.map((role) => (
                            <button key={role.id} type="button" className={selectedRole?.id === role.id ? styles.selectedRole : ""} onClick={() => setSelectedRoleId(role.id)}>
                                <i style={{ backgroundColor: role.color }} />
                                <span><strong>{role.name}</strong><small>{role.permissions.length} permissions</small></span>
                            </button>
                        ))}
                    </aside>

                    {selectedRole && (
                        <div className={styles.roleEditor}>
                            <div className={styles.roleIdentity}>
                                <div className={styles.roleDetailsFields}>
                                    <label>
                                        <span>Role name</span>
                                        <input value={selectedRole.name} onChange={(event) => onUpdateRole(selectedRole.id, { name: event.target.value })} maxLength={24} disabled={selectedRole.id === "owner"} />
                                    </label>
                                </div>
                                <div>
                                    <span>Colour</span>
                                    <div className={styles.roleTonePicker}>
                                        {ROLE_COLORS.map((color) => (
                                            <button key={color} type="button" className={selectedRole.color.toLowerCase() === color ? styles.activeRoleTone : ""} onClick={() => onUpdateRole(selectedRole.id, { color })} aria-label={`Use colour ${color}`}><i style={{ backgroundColor: color }} />{selectedRole.color.toLowerCase() === color && <Check />}</button>
                                        ))}
                                        <label className={`${styles.customRoleColor} ${!ROLE_COLORS.includes(selectedRole.color.toLowerCase()) ? styles.activeRoleTone : ""}`} aria-label="Choose a custom colour">
                                            <input type="color" value={selectedRole.color} onChange={(event) => onUpdateRole(selectedRole.id, { color: event.target.value })} />
                                            <i style={{ backgroundColor: selectedRole.color }}><Palette /></i>
                                            {!ROLE_COLORS.includes(selectedRole.color.toLowerCase()) && <Check />}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.permissionHeading}>
                                <div><ShieldCheck /><span><strong>Permissions</strong><small>Choose what members with this role can do.</small></span></div>
                                <b>{selectedRole.permissions.length} / {COMMUNITY_PERMISSIONS.length}</b>
                            </div>
                            <div className={styles.permissionList}>
                                {COMMUNITY_PERMISSIONS.map((permission) => {
                                    const enabled = selectedRole.permissions.includes(permission.id);
                                    return (
                                        <button key={permission.id} type="button" className={enabled ? styles.permissionEnabled : ""} onClick={() => togglePermission(permission.id)} disabled={selectedRole.id === "owner"} aria-pressed={enabled}>
                                            <span><strong>{permission.label}</strong><small>{permission.description}</small></span>
                                            <i><b /></i>
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedRole.id === "owner" ? (
                                <p className={styles.protectedRoleNote}>The owner role always keeps every permission.</p>
                            ) : !selectedRole.protected && (
                                <button type="button" className={styles.deleteRoleButton} onClick={() => { onDeleteRole(selectedRole.id); setSelectedRoleId(roles[0]?.id ?? ""); }}><Trash2 /> Delete role</button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
