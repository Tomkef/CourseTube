import * as yup from "yup";
import { AnyObject, Maybe } from "yup/lib/types";

yup.addMethod<yup.StringSchema>(yup.string, `noSpaces`, function (args) {
  const message = args?.message || null;
  return this.test(`noSpaces`, message, function (value) {
    const { path, createError } = this;
    return (
      !value.includes(" ") ||
      createError({ path, message: message || `${path} can't contain spaces` })
    );
  });
});

declare module "yup" {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    noSpaces(): StringSchema<TType, TContext>;
  }
}

export default yup;
