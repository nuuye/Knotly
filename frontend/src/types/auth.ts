export interface AuthBrandProps {
    className: string;
}

export interface PasswordFieldProps {
    autoComplete: "current-password" | "new-password";
    id: string;
    label?: string;
    minLength?: number;
    name?: string;
    placeholder: string;
    showForgotPassword?: boolean;
    value: string;
    onChange: (value: string) => void;
}
