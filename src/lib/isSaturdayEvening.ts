const isSaturdayEvening = (): boolean => {
  const now = new Date(); // 現在の日時
  const nowUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  const currentUtcDate = new Date(nowUtc);
  const dayOfWeek = currentUtcDate.getUTCDay(); // 現在の曜日（UTC、0 = 日曜日、1 = 月曜日、...）

  // 土曜日の判定（6は土曜日）
  if (dayOfWeek === 6) {
    const hour = currentUtcDate.getUTCHours();
    const minute = currentUtcDate.getUTCMinutes();

    // 23:50から23:59:59の間かどうかを判定
    if (hour === 23 && minute >= 50) {
      return true;
    }
  }

  return false;
};

export default isSaturdayEvening;
