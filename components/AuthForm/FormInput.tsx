import { Input, InputWrapper } from "@mantine/core";
import React, { MutableRefObject } from "react";

type FormInputProps = {
  error: string;
  inputRef: MutableRefObject<HTMLInputElement>;
  id: string;
  placeHolder: string;
  label: string;
  description?: string;
  type: string;
};

const FormInput = ({
  error,
  inputRef,
  id,
  placeHolder,
  label,
  description = null,
  type,
}: FormInputProps) => {
  return (
    <InputWrapper
      id={id}
      label={label}
      description={description}
      error={error}
      size="md"
      sx={{ paddingBottom: 15 }}
    >
      <Input
        id={id}
        placeholder={placeHolder}
        radius="md"
        type={type}
        ref={inputRef}
      />
    </InputWrapper>
  );
};

export default FormInput;
