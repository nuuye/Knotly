/** Public account data that can safely be displayed in the interface. */
export interface UserAccount {
    username: string;
    email: string;
}

/** Optional profile details do not reveal a legal name. */
export interface UserProfile extends UserAccount {
    avatarUrl: string | null;
    bio: string;
}

/** Password only exists while the signup form is being submitted. */
export interface SignupFormData extends UserAccount {
    password: string;
}
