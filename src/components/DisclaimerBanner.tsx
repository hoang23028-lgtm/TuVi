export default function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-amber-800/90 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
        Lá số tham khảo — có thể khác phương pháp an sao hoặc phần mềm khác. Không thay tư vấn chuyên gia.
      </p>
    );
  }
  return (
    <div className="bg-amber-50/90 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900">
      <p className="font-semibold mb-1">Lưu ý quan trọng</p>
      <p className="text-amber-800/95 leading-relaxed">
        Lá số mang tính <strong>tham khảo</strong>, được tính theo phương pháp Tử Vi Đẩu Số phổ biến
        (nạp âm cung Mệnh, lục giáp Tuần, v.v.). Kết quả có thể khác so với phần mềm hoặc thầy
        dùng quy tắc an sao khác. Luận giải và AI không thay thế tư vấn chuyên sâu.
      </p>
    </div>
  );
}
