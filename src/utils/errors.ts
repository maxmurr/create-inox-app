export class UserCancelledError extends Error {
  constructor() {
    super("User cancelled");
    this.name = "UserCancelledError";
  }
}

export class ScaffoldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScaffoldError";
  }
}
