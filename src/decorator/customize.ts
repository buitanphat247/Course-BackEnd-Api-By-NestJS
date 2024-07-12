import {
  createParamDecorator,
  SetMetadata,
  ExecutionContext,
} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// export const RESPONSE_MESSAGE_METADATA = 'responseMessage';
// export const ResponseMessage = (message: string) =>
//   SetMetadata(RESPONSE_MESSAGE_METADATA, message);

export const ResponseMessage = (message: string) =>
  SetMetadata('response_message', message);

export const NO_TRANSFORM_KEY = 'noTransform';
export const NoTransform = () => SetMetadata(NO_TRANSFORM_KEY, true);
