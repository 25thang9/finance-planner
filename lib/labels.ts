import { Category, Priority, TransactionType } from "@/generated/prisma/enums";
export const CATEGORY_NAMES: Record<Category,string> = {
  FOOD:"Ăn uống", TRANSPORT:"Di chuyển", ENTERTAINMENT:"Giải trí", SHOPPING:"Mua sắm",
  BILLS:"Hóa đơn", SALARY:"Lương", INVESTMENT:"Đầu tư", OTHER:"Khác"
};
export const CATEGORY_COLORS: Record<Category,string> = {
 FOOD:"#6C8CF0", TRANSPORT:"#58B7A6", ENTERTAINMENT:"#E9B86A", SHOPPING:"#AC8DED",
 BILLS:"#F18F92", SALARY:"#4B9E89", INVESTMENT:"#6375B9", OTHER:"#96A6B5"
};
export const PRIORITY_NAMES: Record<Priority,string> = {LOW:"Thấp",MEDIUM:"Trung bình",HIGH:"Cao"};
export const TYPE_NAMES: Record<TransactionType,string> = {INCOME:"Thu nhập",EXPENSE:"Chi tiêu"};
