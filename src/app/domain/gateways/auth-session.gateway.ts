export abstract class AuthSessionGateway {
  abstract logout(): void;
  abstract getToken(): string | null;
  abstract getUserPayload(): any | null;
  abstract isAuthenticated(): boolean;
  abstract getRoles(): string[];
  abstract getEmail(): string | null;
  abstract getNombre(): string | null;
}
