# Phong cảnh: giao diện cho Claude Code

Mười cảnh nền động cho khung chat của Claude Code trên app desktop và mobile, vẽ theo kiểu pixel và halftone. Vật thể nhỏ, nằm sát mép và chuyển động chậm, để khung chat vẫn là trọng tâm.

| Số | Cảnh | Mô tả |
| --- | --- | --- |
| 1 | Hoàng hôn halftone | Mặt trời bằng chấm lặn ở góc, mây chấm trôi |
| 2 | Rừng thông tuyết | Thông pixel hai bên, tuyết rơi, trăng pixel |
| 3 | Synthwave | Mặt trời sọc neon, lưới phát sáng (chỉ có chế độ tối) |
| 4 | Đại dương | Rùa biển pixel bơi ngang, bầy cá, bong bóng |
| 5 | Cực quang | Cực quang nhiều lớp, núi, sao băng |
| 6 | Trời xanh mây trắng | Mây pixel trôi, đàn chim nhỏ; tối là chạng vạng hồng |
| 7 | Thành phố đêm mưa | Nhà cao tầng hai bên, cửa sổ sáng đèn, mưa thưa |
| 8 | Hoa anh đào | Cành hoa ở hai góc trên, cánh hoa rơi |
| 9 | Mùa thu lá rơi | Cây tròn ở góc, đồi ấm, lá phong rơi |
| 10 | Vũ trụ | Hành tinh có vành, mặt trăng nhỏ, sao chổi (chỉ có chế độ tối) |

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

- Đổi cảnh: `/giao-dien 1` đến `/giao-dien 10`, hoặc gõ tên như `/giao-dien dai-duong`. Gõ `/giao-dien` không kèm gì để xem danh sách. Cảnh đã chọn được nhớ cho các phiên sau.

Cảnh nền chỉ hiện trên app desktop và mobile, không hiện trong terminal. Khi bật chế độ giảm chuyển động của hệ điều hành, cảnh đứng yên.
