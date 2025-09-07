import { createCanvas } from 'canvas';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ScoreBreakdown {
  price: number;
  features: number;
  location: number;
  safety: number;
  schools: number;
  commute: number;
}

export function generateScoreBreakdownChart(scoreBreakdown: ScoreBreakdown): string {
  const canvas = createCanvas(400, 300);
  const ctx = canvas.getContext('2d');

  // Set background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 400, 300);

  // Chart configuration
  const chartWidth = 350;
  const chartHeight = 200;
  const chartX = 25;
  const chartY = 50;
  const barWidth = chartWidth / 6;
  const maxValue = 100;

  // Colors for each category
  const colors = {
    price: '#ef4444',
    features: '#f59e0b',
    location: '#10b981',
    safety: '#3b82f6',
    schools: '#8b5cf6',
    commute: '#ec4899'
  };

  // Data preparation
  const data: ChartData[] = [
    { name: 'Price', value: scoreBreakdown.price, color: colors.price },
    { name: 'Features', value: scoreBreakdown.features, color: colors.features },
    { name: 'Location', value: scoreBreakdown.location, color: colors.location },
    { name: 'Safety', value: scoreBreakdown.safety, color: colors.safety },
    { name: 'Schools', value: scoreBreakdown.schools, color: colors.schools },
    { name: 'Commute', value: scoreBreakdown.commute, color: colors.commute }
  ];

  // Draw title
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Ideality Score Breakdown', 200, 25);

  // Draw bars
  data.forEach((item, index) => {
    const x = chartX + index * barWidth;
    const barHeight = (item.value / maxValue) * chartHeight;
    const y = chartY + chartHeight - barHeight;

    // Draw bar
    ctx.fillStyle = item.color;
    ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

    // Draw value on top of bar
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);

    // Draw category name
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillText(item.name, x + barWidth / 2, chartY + chartHeight + 20);
  });

  // Draw grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = chartY + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(chartX, y);
    ctx.lineTo(chartX + chartWidth, y);
    ctx.stroke();
  }

  // Draw Y-axis labels
  ctx.fillStyle = '#6b7280';
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const value = (5 - i) * 20;
    const y = chartY + (chartHeight / 5) * i + 3;
    ctx.fillText(value.toString(), chartX - 5, y);
  }

  // Convert canvas to base64 image
  return canvas.toDataURL('image/png');
}

export function generatePieChart(scoreBreakdown: ScoreBreakdown): string {
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');

  // Set background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 300, 300);

  // Chart configuration
  const centerX = 150;
  const centerY = 150;
  const radius = 100;

  // Colors for each category
  const colors = {
    price: '#ef4444',
    features: '#f59e0b',
    location: '#10b981',
    safety: '#3b82f6',
    schools: '#8b5cf6',
    commute: '#ec4899'
  };

  // Data preparation
  const data: ChartData[] = [
    { name: 'Price', value: scoreBreakdown.price, color: colors.price },
    { name: 'Features', value: scoreBreakdown.features, color: colors.features },
    { name: 'Location', value: scoreBreakdown.location, color: colors.location },
    { name: 'Safety', value: scoreBreakdown.safety, color: colors.safety },
    { name: 'Schools', value: scoreBreakdown.schools, color: colors.schools },
    { name: 'Commute', value: scoreBreakdown.commute, color: colors.commute }
  ];

  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Draw title
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Score Distribution', 150, 25);

  // Draw pie slices
  let currentAngle = -Math.PI / 2; // Start from top

  data.forEach((item, index) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();

    // Draw slice border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
    const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.name, labelX, labelY);

    // Draw percentage
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${Math.round((item.value / total) * 100)}%`, labelX, labelY + 15);

    currentAngle += sliceAngle;
  });

  // Convert canvas to base64 image
  return canvas.toDataURL('image/png');
}
