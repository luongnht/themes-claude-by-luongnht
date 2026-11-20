# Phong cảnh: giao diện cho Claude Code

Năm cảnh nền động cho khung chat của Claude Code trên app desktop và mobile, vẽ theo kiểu pixel và halftone. Vật thể nhỏ, nằm sát mép và chuyển động chậm, để khung chat vẫn là trọng tâm.

| Số | Cảnh | Mô tả |
| --- | --- | --- |
| 1 | Hoàng hôn halftone | Mặt trời bằng chấm lặn ở góc, mây chấm trôi |
| 2 | Rừng thông tuyết | Thông pixel hai bên, tuyết rơi, trăng pixel |
| 3 | Synthwave | Mặt trời sọc neon, lưới phát sáng (chỉ có chế độ tối) |
| 4 | Đại dương | Rùa biển pixel bơi ngang, bầy cá, bong bóng |
| 5 | Cực quang | Cực quang nhiều lớp, núi, sao băng |

## Cài đặt

Trong một phiên Claude Code chạy ở terminal:

```
/plugin install phong-canh --marketplace luongnht/themes-claude-by-luongnht
```

Trả lời `y` khi được hỏi có thêm marketplace không, rồi nhấn Enter để chọn phạm vi user.

Từ shell:

```bash
claude plugin install phong-canh --marketplace luongnht/themes-claude-by-luongnht
```

Trong app desktop (nơi `/plugin` không chạy): bấm dấu + cạnh ô nhập, chọn Plugins, chọn Add marketplace và nhập `luongnht/themes-claude-by-luongnht`, rồi chọn Add plugin.

## Cách dùng

- Đổi cảnh: `/giao-dien 1` đến `/giao-dien 5`, hoặc gõ tên như `/giao-dien dai-duong`. Gõ `/giao-dien` không kèm gì để xem danh sách. Cảnh đã chọn được nhớ cho các phiên sau.
- Pháo hoa pixel tự bắn khi Claude chạy `git commit`, `git push`, `git merge` hoặc `gh pr merge` thành công, khi Claude làm xong một việc dài trên 1 phút, và khi bạn bấm vào chỗ trống trên nền.
- Trên app desktop, rê chuột qua nền để thấy vệt chấm sáng đi theo.

Cảnh nền chỉ hiện trên app desktop và mobile, không hiện trong terminal. Khi bật chế độ giảm chuyển động của hệ điều hành, cảnh đứng yên.
