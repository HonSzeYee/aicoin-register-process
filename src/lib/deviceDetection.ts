export type DeviceRole = "PC" | "iOS" | "Android";

/**
 * 根据 User Agent 自动检测设备类型
 * 返回 PC、iOS 或 Android
 */
export function detectDeviceType(): DeviceRole {
  if (typeof window === "undefined") {
    return "PC"; // 服务端渲染默认返回 PC
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  // 检测 iOS 设备（iPhone、iPad、iPod）
  // 注意：iPadOS 13+ 的 iPad 在 Safari 中会显示为 Mac，需要特殊处理
  const isIOS =
    /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes("mac") && "ontouchend" in document && navigator.maxTouchPoints > 1);

  // 检测 Android 设备
  const isAndroid = /android/.test(userAgent);

  if (isIOS) {
    return "iOS";
  } else if (isAndroid) {
    return "Android";
  } else {
    // 默认返回 PC（包括桌面浏览器、Windows、Mac、Linux 等）
    return "PC";
  }
}

