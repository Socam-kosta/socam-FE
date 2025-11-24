// ========== 엑셀 다운로드 유틸리티 ==========
import ExcelJS from "exceljs";

/**
 * 테이블 데이터를 엑셀 파일로 다운로드
 */
export async function downloadExcel(
  data: any[],
  headers: { key: string; label: string; width?: number }[],
  filename: string
) {
  // 워크북 생성
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // 헤더 스타일 정의
  const headerStyle: Partial<ExcelJS.Style> = {
    font: { bold: true, color: { argb: "FFFFFFFF" } },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4B5563" }, // 진회색
    },
    alignment: { horizontal: "center" as const, vertical: "middle" as const },
    border: {
      top: { style: "thin" as const },
      left: { style: "thin" as const },
      bottom: { style: "thin" as const },
      right: { style: "thin" as const },
    },
  };

  // 헤더 추가
  worksheet.columns = headers.map((header) => ({
    header: header.label,
    key: header.key,
    width: header.width || 15,
  }));

  // 헤더 행 스타일 적용
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.style = headerStyle;
  });

  // 데이터 추가
  data.forEach((item) => {
    const row = worksheet.addRow(
      headers.map((header) => item[header.key] || "")
    );

    // 데이터 행 스타일
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
      cell.alignment = { vertical: "middle" };
    });
  });

  // 행 높이 조정
  worksheet.getRow(1).height = 25;
  worksheet.eachRow((row) => {
    row.height = 20;
  });

  // 엑셀 파일 생성 및 다운로드
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
