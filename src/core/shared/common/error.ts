export const ErrorHandler = {
  invalid(message: string): string {
    return `inValid: The ${message} is invalid`;
  },

  alreadyExists(message: string): string {
    return `${message} already exists`;
  },

  notFound(message: string): string {
    return `${message} does not exist`;
  },

  notAllow(message: string): string {
    return `notAllow:The ${message} is not allowed to access`;
  },

  notAvailable(message: string): string {
    return `notAvailable:The ${message} is not available to process`;
  },
};
