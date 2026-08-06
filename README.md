# Chợ Việc — Bảng tin tuyển dụng

Website tìm việc làm tĩnh (HTML/CSS/JS thuần), chạy hoàn toàn trên trình duyệt — không cần server hay build step. Có thể deploy miễn phí bằng GitHub Pages.

## Cấu trúc

```
job-board/
├── index.html    # Khung trang + form tìm kiếm/lọc
├── style.css     # Giao diện "bảng tin dán tờ rơi"
├── script.js     # Logic lọc, sắp xếp, render danh sách việc làm
├── data.js       # Dữ liệu việc làm mẫu (sửa hoặc thay bằng dữ liệu thật)
└── README.md
```

## Tính năng

- Tìm theo từ khoá (chức danh, công ty, kỹ năng)
- Lọc theo khu vực, ngành nghề, hình thức làm việc
- Chip lọc nhanh theo ngành phổ biến
- Sắp xếp theo tin mới nhất / mức lương
- Nút "Lưu tin" tạm thời (trong phiên duyệt web)
- Responsive, hỗ trợ điều hướng bàn phím

## Chạy thử ở máy

Chỉ cần mở `index.html` bằng trình duyệt, hoặc dùng server tĩnh đơn giản:

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

## Đưa lên GitHub

```bash
git init
git add .
git commit -m "Khởi tạo website Chợ Việc"
git branch -M main
git remote add origin https://github.com/<username>/<ten-repo>.git
git push -u origin main
```

## Bật GitHub Pages

1. Vào repo trên GitHub → **Settings** → **Pages**
2. Ở mục **Build and deployment**, chọn **Source: Deploy from a branch**
3. Chọn **Branch: main**, thư mục **/ (root)** → **Save**
4. Sau 1–2 phút, trang sẽ chạy tại:
   `https://<username>.github.io/<ten-repo>/`

## Thay bằng dữ liệu việc làm thật

Sửa mảng `JOBS` trong `data.js`. Mỗi tin cần các trường:

```js
{
  id: "CV-xxxx",
  title: "Tên vị trí",
  company: "Tên công ty",
  location: "Khu vực",
  category: "Ngành nghề",
  type: "Toàn thời gian" | "Bán thời gian" | "Thực tập" | "Từ xa",
  salaryMin: 10, salaryMax: 20,   // triệu VNĐ/tháng
  tags: ["kỹ năng 1", "kỹ năng 2"],
  postedDaysAgo: 0,
  code: "1234"
}
```

Muốn lấy dữ liệu từ API hay file JSON riêng thay vì mảng tĩnh, chỉ cần thay phần khai báo `JOBS` trong `data.js` bằng một `fetch()` và render lại sau khi có dữ liệu.
