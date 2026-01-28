export interface Badge {
    id: string;
    icon: string;
    label: string;
    gradient: [string, string];
}

export interface Skill {
    id: string;
    label: string;
}

export interface ProfileData {
    name: string;
    role: string;
    avatar: string;
    badges: Badge[];
    skills: Skill[];
}
