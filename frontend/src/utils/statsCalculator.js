/**
 * Thống kê mẫu số liệu không ghép nhóm theo SGK Toán 10 (Kết nối tri thức với cuộc sống)
 */

export function parseRawData(rawData, mode = 'simple') {
  if (!rawData || !rawData.trim()) {
    return [];
  }

  const text = rawData.trim();

  if (mode === 'frequency') {
    // Thử JSON trước
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        const result = [];
        for (const item of data) {
          const val = parseFloat(item.value ?? item.x ?? 0);
          const freq = parseInt(item.frequency ?? item.n ?? item.m ?? 1, 10);
          if (!isNaN(val) && !isNaN(freq) && freq >= 1) {
            for (let i = 0; i < freq; i++) result.push(val);
          }
        }
        if (result.length > 0) return result;
      }
    } catch (e) {
      // Bỏ qua nếu không phải JSON
    }

    // Tách theo dòng: giá trị : tần số hoặc giá trị ; tần số
    const lines = text.split('\n');
    const result = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(/[:;\t\s]+/);
      if (parts.length >= 2) {
        const val = parseFloat(parts[0].replace(',', '.'));
        const freq = parseInt(parts[1], 10);
        if (!isNaN(val) && !isNaN(freq) && freq >= 1) {
          for (let i = 0; i < freq; i++) result.push(val);
        }
      } else if (parts.length === 1) {
        const val = parseFloat(parts[0].replace(',', '.'));
        if (!isNaN(val)) result.push(val);
      }
    }
    return result;
  } else {
    // Simple mode
    // Nếu có dấu chấm phẩy (;), coi dấu phẩy (,) là số thập phân kiểu Việt Nam (ví dụ 8,5; 9,0)
    if (text.includes(';')) {
      const tokens = text.split(';');
      const numbers = [];
      for (const t of tokens) {
        const clean = t.trim().replace(',', '.');
        if (clean) {
          const val = parseFloat(clean);
          if (!isNaN(val)) numbers.push(val);
        }
      }
      if (numbers.length > 0) return numbers;
    }

    // Tách bằng khoảng trắng hoặc phẩy
    const normalized = text.replace(/,/g, ' ');
    const tokens = normalized.split(/\s+/);
    const numbers = [];
    for (const token of tokens) {
      if (!token) continue;
      const val = parseFloat(token);
      if (!isNaN(val)) numbers.push(val);
    }
    return numbers;
  }
}

function calculateMedian(sortedArr) {
  const n = sortedArr.length;
  if (n === 0) return { value: 0, explanation: '' };

  if (n % 2 === 1) {
    const idx = Math.floor((n - 1) / 2);
    const val = sortedArr[idx];
    const explanation = `Vì cỡ mẫu n = ${n} là số lẻ, trung vị là phần tử thứ \\frac{${n}+1}{2} = ${idx + 1}: x_{${idx + 1}} = ${val}`;
    return { value: val, explanation };
  } else {
    const idx1 = Math.floor(n / 2) - 1;
    const idx2 = Math.floor(n / 2);
    const val = Number(((sortedArr[idx1] + sortedArr[idx2]) / 2).toFixed(4));
    const explanation = `Vì cỡ mẫu n = ${n} là số chẵn, trung vị là trung bình cộng của 2 phần tử chính giữa (thứ ${idx1 + 1} và ${idx2 + 1}): \\frac{${sortedArr[idx1]} + ${sortedArr[idx2]}}{2} = ${val}`;
    return { value: val, explanation };
  }
}

export function computeStatistics(rawData, mode = 'simple') {
  const values = parseRawData(rawData, mode);
  const n = values.length;

  if (n === 0) {
    return null;
  }

  // 1. Sắp xếp không giảm
  const sortedValues = [...values].sort((a, b) => a - b);
  const minVal = sortedValues[0];
  const maxVal = sortedValues[n - 1];
  const rangeVal = Number((maxVal - minVal).toFixed(4));

  // 2. Số trung bình cộng (\bar{x})
  const sumVal = sortedValues.reduce((acc, curr) => acc + curr, 0);
  const meanVal = Number((sumVal / n).toFixed(4));

  // 3. Trung vị và Tứ phân vị chuẩn SGK Toán 10 KNTT
  const q2Res = calculateMedian(sortedValues);
  const q2Val = q2Res.value;
  const medianVal = q2Val;

  let lowerHalf = [];
  let upperHalf = [];
  let q1Val = 0;
  let q3Val = 0;

  if (n === 1) {
    q1Val = sortedValues[0];
    q3Val = sortedValues[0];
    lowerHalf = [sortedValues[0]];
    upperHalf = [sortedValues[0]];
  } else if (n % 2 === 1) {
    // n lẻ: không tính trung vị Q2
    const k = Math.floor((n - 1) / 2);
    lowerHalf = sortedValues.slice(0, k);
    upperHalf = sortedValues.slice(k + 1);
    q1Val = calculateMedian(lowerHalf).value;
    q3Val = calculateMedian(upperHalf).value;
  } else {
    // n chẵn: chia đôi
    const k = Math.floor(n / 2);
    lowerHalf = sortedValues.slice(0, k);
    upperHalf = sortedValues.slice(k);
    q1Val = calculateMedian(lowerHalf).value;
    q3Val = calculateMedian(upperHalf).value;
  }

  q1Val = Number(q1Val.toFixed(4));
  q3Val = Number(q3Val.toFixed(4));
  const iqrVal = Number((q3Val - q1Val).toFixed(4));

  // 4. Mốt (Mo)
  const freqMap = {};
  for (const v of sortedValues) {
    freqMap[v] = (freqMap[v] || 0) + 1;
  }
  const maxFreq = Math.max(...Object.values(freqMap));
  const uniqueValues = Object.keys(freqMap);

  let modes = [];
  let hasMode = true;

  if (maxFreq === 1 && n > 1) {
    hasMode = false;
  } else if (uniqueValues.length > 1 && uniqueValues.every(k => freqMap[k] === maxFreq)) {
    hasMode = false;
  } else {
    modes = uniqueValues.filter(k => freqMap[k] === maxFreq).map(Number).sort((a, b) => a - b);
  }

  // 5. Phương sai và độ lệch chuẩn (SGK 10: chia cho n)
  const sumSqDiff = sortedValues.reduce((acc, curr) => acc + Math.pow(curr - meanVal, 2), 0);
  const varianceVal = Number((sumSqDiff / n).toFixed(4));
  const stdDevVal = Number(Math.sqrt(varianceVal).toFixed(4));

  // Phương sai mẫu hiệu chỉnh (n-1)
  const varianceUnbiased = n > 1 ? Number((sumSqDiff / (n - 1)).toFixed(4)) : 0;
  const stdDevUnbiased = n > 1 ? Number(Math.sqrt(varianceUnbiased).toFixed(4)) : 0;

  // 6. Giá trị ngoại lệ (Outliers)
  const lowerBound = Number((q1Val - 1.5 * iqrVal).toFixed(4));
  const upperBound = Number((q3Val + 1.5 * iqrVal).toFixed(4));
  const outliers = sortedValues.filter(x => x < lowerBound || x > upperBound);

  // 7. Bảng tần số
  const frequencyTable = Object.entries(freqMap)
    .map(([val, freq]) => ({
      value: Number(val),
      frequency: freq,
      relative_freq: Number(((freq / n) * 100).toFixed(2))
    }))
    .sort((a, b) => a.value - b.value);

  // 8. KaTeX formulas
  const formulaSteps = {
    mean_latex: `\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n} = \\frac{${Number(sumVal.toFixed(2))}}{${n}} = ${meanVal}`,
    median_latex: `M_e = Q_2 = ${medianVal}`,
    median_note: q2Res.explanation,
    q1_latex: `Q_1 = ${q1Val} \\quad (\\text{Trung vị của nửa dưới: } [${lowerHalf.join(', ')}])`,
    q3_latex: `Q_3 = ${q3Val} \\quad (\\text{Trung vị của nửa trên: } [${upperHalf.join(', ')}])`,
    iqr_latex: `\\Delta_Q = Q_3 - Q_1 = ${q3Val} - ${q1Val} = ${iqrVal}`,
    range_latex: `R = x_{max} - x_{min} = ${maxVal} - ${minVal} = ${rangeVal}`,
    variance_latex: `s^2 = \\frac{1}{n}\\sum_{i=1}^{n} (x_i - \\bar{x})^2 = \\frac{${Number(sumSqDiff.toFixed(4))}}{${n}} = ${varianceVal}`,
    std_dev_latex: `s = \\sqrt{s^2} = \\sqrt{${varianceVal}} = ${stdDevVal}`,
    outlier_condition_latex: `x < Q_1 - 1{,}5\\Delta_Q = ${lowerBound} \\quad \\text{hoặc} \\quad x > Q_3 + 1{,}5\\Delta_Q = ${upperBound}`,
    mode_latex: hasMode ? `M_o = ${modes.join(', ')}` : `\\text{Không có mốt}`
  };

  return {
    sample_size: n,
    sorted_values: sortedValues,
    min_value: minVal,
    max_value: maxVal,
    mean: meanVal,
    median: medianVal,
    q1: q1Val,
    q2: q2Val,
    q3: q3Val,
    iqr: iqrVal,
    range_val: rangeVal,
    variance: varianceVal,
    std_dev: stdDevVal,
    variance_unbiased: varianceUnbiased,
    std_dev_unbiased: stdDevUnbiased,
    modes: modes,
    mode_frequency: maxFreq,
    has_mode: hasMode,
    outlier_lower_bound: lowerBound,
    outlier_upper_bound: upperBound,
    outliers: outliers,
    frequency_table: frequencyTable,
    formula_steps: formulaSteps
  };
}
