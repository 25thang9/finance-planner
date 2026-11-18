import {describe,it,expect} from "vitest";
import {render,screen} from "@testing-library/react";
import {EmptyState} from "@/components/ui/empty-state";
describe("React Testing Library – component test",()=>{
 it("hiển thị tiêu đề và hướng dẫn trong trạng thái rỗng",()=>{
  render(<EmptyState title="Chưa có giao dịch" description="Thêm giao dịch mới để bắt đầu"/>);
  expect(screen.getByRole("region",{name:"Chưa có giao dịch"})).toBeInTheDocument();
  expect(screen.getByText("Thêm giao dịch mới để bắt đầu")).toBeVisible();
 });
});
