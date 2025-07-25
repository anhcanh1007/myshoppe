import { useForm } from "react-hook-form";
import { schema, type Schema } from "../ultils/rules";
import useQueryConfig from "./useQueryConfig";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { createSearchParams, useNavigate } from "react-router-dom";
import { path } from "../constants/path";
import omit from "lodash/omit";

type FormData = Pick<Schema, "name">;

const nameSchema = schema.pick(["name"]);

export default function useSearchProducts() {
  const queryConfig = useQueryConfig();

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(nameSchema),
  });
  const navigate = useNavigate();

  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name,
          },
          ["order", "sort_by"]
        )
      : {
          ...queryConfig,
          name: data.name,
        };
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString(),
    });
  });
  return { onSubmitSearch, register };
}
