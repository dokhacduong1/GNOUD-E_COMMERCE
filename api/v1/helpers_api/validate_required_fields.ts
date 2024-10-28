import { Response } from 'express';

interface RequiredField {
  field: any;
  message: string;
  validate?: (value: any) => boolean;
}

//Function validateRequiredFields()
export const validateRequiredFields = (
  requiredFields: RequiredField[],
  res: Response
): boolean => {
  for (const { field, message, validate } of requiredFields) {
    if (!field || (validate && !validate(field))) {
      res.status(400).json({ code: 400, message });
      return false;
    }
  }
  return true;
};
