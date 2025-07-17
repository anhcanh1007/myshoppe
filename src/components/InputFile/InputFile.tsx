import { useRef } from "react";
import { Fragment } from "react/jsx-runtime";
import config from "../../constants/config";
import { toast } from "react-toastify";

interface Props {
  onChange?: (file?: File) => void;
}

export default function InputFile({ onChange }: Props) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const onChangeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0];
    if (fileFromLocal && fileFromLocal.size >= config.maxSizeUploadAvatar) {
      toast.error("Không đúng định dạng ảnh", { position: "top-center" });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChange && onChange(fileFromLocal);
    }
  };
  const handleUpload = () => {
    inputFileRef.current?.click();
  };
  return (
    <Fragment>
      <input
        className="hidden"
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={inputFileRef}
        onChange={onChangeUpload}
        onClick={(e) => (e.target as any).value}
      />
      <button
        type="button"
        className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm"
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </Fragment>
  );
}
