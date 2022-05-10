export class NoChaptersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoChaptersError";
  }
}

export class YoutubeVideoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "YoutubeVideoError";
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class BadSessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadSessionError";
  }
}

export class UsernameOrEmailInUse extends Error {
  errors: { inputField: string; errorMessage: string }[];
  constructor(
    message: string,
    errors: { inputField: string; errorMessage: string }[]
  ) {
    super(message);
    this.name = "UsernameOrEmailInUse";
    this.errors = errors;
  }
}
