import React from "react";
import { View, StyleSheet } from "react-native";
// Sửa lỗi: Đảm bảo các imports này được khai báo và có sẵn trong môi trường React Native/Expo.
// Sử dụng react-native-svg để tạo logo vector
import Svg, { Circle, Rect, Line, Text as SvgText } from "react-native-svg";

const Logo = ({ size = 100, color = "#fff", backgroundColor = "#5e56d4" }) => {
  // Điều chỉnh kích thước và vị trí dựa trên prop size
  const strokeWidth = size * 0.05;
  const center = size / 2;
  const circleRadius = size * 0.4;
  // const ballRadius = size * 0.3; // Biến này không được sử dụng, có thể loại bỏ

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 1. Nền hình tròn (Màu chủ đạo) - Đại diện cho quả bóng hoặc biểu tượng ứng dụng */}
        <Circle
          cx={center}
          cy={center}
          r={circleRadius}
          fill={backgroundColor}
        />

        {/* 2. Tạo hình ảnh biểu tượng: Kết hợp 'B' và 'G' cách điệu */}

        {/* Đường thẳng đứng (Trục chính) */}
        <Line
          x1={center * 0.8} // Dịch chuyển sang trái một chút
          y1={center * 0.3}
          x2={center * 0.8}
          y2={center * 1.7}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Vòng cung trên (Tạo hình chữ B) */}
        <Circle
          cx={center * 1.15}
          cy={center * 0.55}
          r={center * 0.35} // Tăng bán kính vòng cung
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          // Chỉ hiển thị nửa vòng cung bên phải (Bắt đầu từ 270 độ, quét 180 độ)
          strokeDasharray={`${(Math.PI * center * 0.7) / 2}, 1000`}
          strokeDashoffset={-(Math.PI * center * 0.7) / 2}
          transform={`rotate(90, ${center * 1.15}, ${center * 0.55})`} // Xoay 90 độ để vòng cung nằm bên phải
        />

        {/* Vòng cung dưới (Tạo hình chữ G) */}
        <Circle
          cx={center * 1.15}
          cy={center * 1.45}
          r={center * 0.35} // Tăng bán kính vòng cung
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          // Chỉ hiển thị nửa vòng cung bên phải
          strokeDasharray={`${(Math.PI * center * 0.7) / 2}, 1000`}
          strokeDashoffset={-(Math.PI * center * 0.7) / 2}
          transform={`rotate(90, ${center * 1.15}, ${center * 1.45})`} // Xoay 90 độ
        />

        {/* Đường ngang giữa chữ B và G */}
        <Line
          x1={center * 0.8}
          y1={center}
          x2={center * 1.2}
          y2={center}
          stroke={color}
          strokeWidth={strokeWidth * 0.5}
          strokeLinecap="round"
        />

        {/* Chữ B và G cách điệu, tượng trưng cho BookGoal - Đã ẩn chữ để tăng tính biểu tượng của SVG */}
        {/* <SvgText
                    fill={color}
                    fontSize={size * 0.25}
                    fontWeight="bold"
                    x={center * 1.05}
                    y={center * 0.65}
                    textAnchor="middle"
                >B</SvgText>

                 <SvgText
                    fill={color}
                    fontSize={size * 0.25}
                    fontWeight="bold"
                    x={center * 1.05}
                    y={center * 1.6}
                    textAnchor="middle"
                >G</SvgText>
                */}
      </Svg>
    </View>
  );
};

export default Logo;
