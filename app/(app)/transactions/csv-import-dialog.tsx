
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ApiResult = {
  validRows?: number;
  imported?: number;
  message?: string;
  error?: string;
  errors?: string[];
};

export function CsvImportDialog() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [validRows, setValidRows] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // Tạo file CSV mẫu để tải về
  function downloadTemplate() {
    const csv = [
      "Ngày,Loại,Số tiền (VND),Danh mục,Mô tả",
      "2026-11-20,EXPENSE,85000,FOOD,Ăn trưa",
      "2026-11-19,EXPENSE,150000,FOOD,Mua thực phẩm",
    ].join("\r\n");

    const blob = new Blob(
      ["\uFEFF", csv, "\r\n"],
      {
        type: "text/csv;charset=utf-8",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      "finance-planner-mau-giao-dich.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  // Kiểm tra hoặc nhập CSV
  async function handleUpload(
    mode: "preview" | "import"
  ) {
    if (!file || loading) return;

    setLoading(true);
    setMessage("");
    setErrors([]);

    const body = new FormData();

    body.append("file", file);
    body.append("mode", mode);

    try {
      const response = await fetch(
        "/api/transactions/import",
        {
          method: "POST",
          body,
        }
      );

      const result =
        (await response.json()) as ApiResult;

      if (!response.ok) {
        setValidRows(null);
        setMessage(
          result.error ??
            "Không thể xử lý file CSV."
        );
        setErrors(result.errors ?? []);
        return;
      }

      // Chỉ kiểm tra, chưa lưu
      if (mode === "preview") {
        setValidRows(result.validRows ?? null);

        setMessage(
          `File hợp lệ: ${result.validRows} giao dịch. ` +
          "Chưa lưu dữ liệu."
        );

        return;
      }

      // Nhập thành công
      setMessage(
        `Đã nhập thành công ${result.imported} giao dịch.`
      );

      setValidRows(null);
      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      router.refresh();
    } catch {
      setValidRows(null);
      setMessage(
        "Không thể kết nối đến máy chủ."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload size={16} />
          Nhập CSV
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-xl font-bold">
          Nhập giao dịch từ CSV
        </DialogTitle>

        <DialogDescription className="mt-1">
          Tải file mẫu, điền thông tin giao dịch,
          sau đó kiểm tra trước khi nhập vào Finance Planner.
        </DialogDescription>

        <div className="mt-4 space-y-4">
          {/* Chọn file và tải mẫu */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="csv-file"
                className="text-sm font-semibold"
              >
                Chọn file CSV
              </label>

              <Button
                type="button"
                variant="outline"
                onClick={downloadTemplate}
              >
                <Download size={15} />
                Tải file mẫu
              </Button>
            </div>

            <input
              id="csv-file"
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="
                block w-full rounded-xl
                border border-[var(--border)]
                p-3 text-sm
              "
              onChange={(event) => {
                setFile(
                  event.target.files?.[0] ?? null
                );
                setValidRows(null);
                setMessage("");
                setErrors([]);
              }}
            />
          </div>

          {/* Hướng dẫn định dạng */}
          <div className="space-y-1 text-xs text-[var(--muted-foreground)]">
            <p>
              Định dạng: CSV UTF-8, tối đa
              500 giao dịch và 2 MB.
            </p>

            <p>
              Ngày: YYYY-MM-DD.
              Loại: INCOME hoặc EXPENSE.
            </p>

            <p>
              Số tiền: số nguyên dương.
              Danh mục: mã hợp lệ của hệ thống.
            </p>

            <p>
              File mẫu chỉ chứa dữ liệu minh họa.
              Hãy thay hoặc xóa dữ liệu mẫu
              trước khi nhập thật.
            </p>
          </div>

          {/* Nút kiểm tra và nhập */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!file || loading}
              onClick={() =>
                void handleUpload("preview")
              }
            >
              {loading
                ? "Đang xử lý..."
                : "Kiểm tra file"}
            </Button>

            <Button
              type="button"
              disabled={
                validRows === null || loading
              }
              onClick={() =>
                void handleUpload("import")
              }
            >
              Nhập {validRows ?? ""} giao dịch
            </Button>
          </div>

          {/* Thông báo kết quả */}
          {message && (
            <p
              role="status"
              className="text-sm font-medium"
            >
              {message}
            </p>
          )}

          {/* Danh sách lỗi */}
          {errors.length > 0 && (
            <div
              role="alert"
              className="
                max-h-44 overflow-y-auto
                rounded-xl border border-rose-300
                p-3 text-sm text-rose-600
              "
            >
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
