export const DEMO_DATA_PRESETS = [
  {
    id: 'demo-1',
    name: 'Điểm kiểm tra giữa kì môn Toán 10 (Lớp 10A1)',
    mode: 'simple',
    rawData: '7.5, 8.0, 6.5, 9.0, 8.5, 7.0, 8.0, 9.5, 4.0, 8.5, 9.0, 8.0, 7.5, 10.0, 1.5, 8.0, 7.0, 8.5, 9.0, 6.0',
    notes: 'Bài toán mẫu SGK Toán 10 KNTT: Mẫu số liệu có chứa điểm ngoại lệ bất thường x = 1.5 (học sinh bị ốm phải bỏ dở bài thi).'
  },
  {
    id: 'demo-2',
    name: 'Bảng tần số: Số con trong 40 hộ gia đình ở thôn An Bình',
    mode: 'frequency',
    rawData: '0: 4\n1: 12\n2: 18\n3: 5\n4: 1',
    notes: 'Khảo sát quy mô gia đình theo bảng tần số mẫu không ghép nhóm. Cỡ mẫu n = 40 hộ.'
  },
  {
    id: 'demo-3',
    name: 'Chiều cao 15 học sinh nam đội bóng rổ lớp 10 (cm)',
    mode: 'simple',
    rawData: '168, 172, 170, 175, 169, 171, 174, 182, 170, 173, 168, 176, 172, 170, 195',
    notes: 'Đo lường các số đặc trưng đo độ phân tán (R, Delta_Q, s) và phát hiện chiều cao đột biến x = 195 cm.'
  },
  {
    id: 'demo-4',
    name: 'Thời gian chạy cự ly 100m của các vận động viên (giây)',
    mode: 'simple',
    rawData: '12.2, 11.8, 12.5, 11.5, 12.0, 13.1, 11.9, 12.3, 12.1, 11.7, 14.8',
    notes: 'Khảo sát thành tích thể thao lớp 10, phát hiện giá trị ngoại lệ x = 14.8s.'
  },
  {
    id: 'demo-5',
    name: 'Bảng tần số điểm đánh giá sản phẩm (Thang điểm 1 - 5)',
    mode: 'frequency',
    rawData: '1: 2\n2: 4\n3: 15\n4: 25\n5: 14',
    notes: 'Khảo sát mức độ hài lòng của 60 khách hàng với điểm số từ 1 đến 5 sao.'
  }
];
