export interface IProfile {
    name: string[];
    picture: string;
    groups: string[];
    permissions: string[];
    roles: string[];
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
}
