export const getLastSundayTime = (): number => {
  const now = new Date();
  const nowUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds()
  );

  const currentDayUtc = new Date(nowUtc).getUTCDay(); // 現在の曜日（UTC）
  const diffToLastSunday = currentDayUtc === 0 ? 7 : currentDayUtc; // 日曜日までの差分（日曜日が0なら前週の日曜日、それ以外はその曜日数分引く）

  const lastSundayUtc = new Date(nowUtc);
  lastSundayUtc.setUTCDate(lastSundayUtc.getUTCDate() - diffToLastSunday);
  lastSundayUtc.setUTCHours(0, 0, 0, 0);

  const unixEpochTimeOfLastSundayUtc = lastSundayUtc.getTime(); // UNIXエポック時間（ミリ秒、UTC）を取得

  return unixEpochTimeOfLastSundayUtc;
};
