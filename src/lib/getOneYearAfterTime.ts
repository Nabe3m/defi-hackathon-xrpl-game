export const getOneYearAfterTime = (): number => {
  // 現在のUTC日時を取得
  const now = new Date();
  const currentUTCDate = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  // 1年後のUTC日時を取得
  const oneYearLaterUTC = new Date(currentUTCDate + 365 * 24 * 60 * 60 * 1000);

  // 1年後のUTC日時をUNIXエポックタイムに変換（ミリ秒から秒に変換）
  return Math.floor(oneYearLaterUTC.getTime());
};
