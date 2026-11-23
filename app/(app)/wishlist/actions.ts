
"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  wishlistSchema,
  readFields,
  type WishlistFormState,
} from "@/lib/validation";

const fields = [
  "name",
  "cost",
  "priority",
  "deadline",
] as const;

const idSchema = z.string().min(1).max(100);

function refresh() {
  revalidatePath("/wishlist");
  revalidatePath("/dashboard");
}

function parseDeadline(
  value: string
): Date | null | undefined {
  if (value === "") {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  const date = new Date(
    `${value}T00:00:00.000Z`
  );

  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return undefined;
  }

  return date;
}

export async function saveWishlist(
  id: string | null,
  _prev: WishlistFormState,
  formData: FormData
): Promise<WishlistFormState> {
  const user = await requireUser();
  const values = readFields(formData, fields);

  // Giữ nguyên Zod schema hiện tại cho
  // tên, giá và mức độ ưu tiên.
  const { deadline: deadlineText, ...baseValues } = values;

  const valid = wishlistSchema.safeParse(baseValues);

  if (!valid.success) {
    return {
      values,
      errors: z.flattenError(valid.error).fieldErrors,
    };
  }

  const deadline = parseDeadline(deadlineText);

  if (deadline === undefined) {
    return {
      values,
      message:
        "Hạn chót không hợp lệ. Vui lòng chọn lại ngày.",
    };
  }

  if (
    id !== null &&
    !idSchema.safeParse(id).success
  ) {
    return {
      values,
      message: "ID không hợp lệ",
    };
  }

  try {
    if (id) {
      const result =
        await prisma.wishlistItem.updateMany({
          where: {
            id,
            userId: user.id,
          },
          data: {
            ...valid.data,
            deadline,
          },
        });

      if (!result.count) {
        return {
          values,
          message:
            "Món đồ không thuộc tài khoản của bạn",
        };
      }
    } else {
      await prisma.wishlistItem.create({
        data: {
          ...valid.data,
          deadline,
          userId: user.id,
        },
      });
    }

    refresh();

    return {
      ok: true,
      message: id
        ? "Đã cập nhật mục tiêu"
        : "Đã thêm mục tiêu mới",
      nonce: Date.now(),
    };
  } catch {
    return {
      values,
      message: "Không thể lưu mục tiêu",
    };
  }
}

export async function deleteWishlist(
  formData: FormData
) {
  const user = await requireUser();

  const id = idSchema.safeParse(
    formData.get("id")
  );

  if (!id.success) {
    throw new Error("ID không hợp lệ");
  }

  const deleted =
    await prisma.wishlistItem.deleteMany({
      where: {
        id: id.data,
        userId: user.id,
      },
    });

  if (!deleted.count) {
    throw new Error(
      "Món đồ không thuộc tài khoản"
    );
  }

  refresh();
}
