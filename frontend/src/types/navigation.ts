export interface NavBarButton {
    label: string;
    contained: boolean;
    link: "/" | "/explore" | "/faq" | "/login" | "/signup";
}

export interface NavBarProps {
    buttons?: NavBarButton[];
}
