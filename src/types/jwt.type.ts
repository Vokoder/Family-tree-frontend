export interface JwtAccessTokenPayload {
  uid: string;
  login: string;
  roleId: string;
}

export interface Jwt {
  accessToken: string;
  refreshToken: string;
}
