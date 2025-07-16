import axios, { AxiosError } from "axios";
import HttpStatusCode from "../constants/httpStatusCode.enum";
import config from "../constants/config";

import userImage from "../assets/user/user.svg";

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError<FormError>(
  error: unknown
): error is FormError {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.UnprocessableEntity
  );
}

export function formatCurrency(curency: number) {
  return new Intl.NumberFormat("de-DE").format(curency);
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    notation: "compact",
  })
    .format(value)
    .replace(".", ",")
    .toLowerCase();
}

export const rateSale = (original: number, sale: number) =>
  ((original - sale) / original) * 100 + "%";

const removeSpecialCharacter = (str: string) =>
  str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ""
  );

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, "-") + `-i-${id}`;
};

export const getIdFromNameID = (nameId: string) => {
  const arr = nameId.split("-i-");
  return arr[arr.length - 1];
};

export const getAvatarUrl = (avatarName?: string) => {
  return avatarName ? `${config.baseURL}images/${avatarName}` : userImage;
};
