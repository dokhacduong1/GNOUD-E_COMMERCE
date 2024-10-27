import { raw } from "mysql2";
import WebOptions from "../models/web_options.model";

export function getWebOptions(): Promise<any> {
  const data = WebOptions.findOne({ where: { ID: 1 }, raw: true });
  return data;
}
