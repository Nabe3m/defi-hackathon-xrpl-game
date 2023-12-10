import { NextResponse } from "next/server";
import {
  Client,
  Wallet,
  Transaction,
  rippleTimeToUnixTime,
  xrpToDrops,
  unixTimeToRippleTime,
  dropsToXrp,
} from "xrpl";
// import { XrplTransaction } from "xumm-sdk/dist/src/types";
import { getOneYearAfterTime } from "@/lib/getOneYearAfterTime";
import { getLastSundayTime } from "@/lib/getLastSundayTime";

// XRP Ledgerへの接続情報
const XRPL_SERVER: string = process.env.NEXT_PUBLIC_XRPL_SERVER || "";
const OWNER_WALLET: Wallet = Wallet.fromSecret(
  process.env.NEXT_PUBLIC_OWNER_WALLET_SECRET || ""
);
const ESCROW_ADDRESS: string = "";
let ownerXrpBalance: number = 0;

export async function GET() {
  try {
    if (!XRPL_SERVER) {
      throw new Error("The server connection destination is not defined.");
    }
    if (!OWNER_WALLET) {
      throw new Error("Owner's wallet is not defined.");
    }

    // ownerXrpBalance = 9994999900;
    // const winnerCount = 100; // 当選者数
    // const amountPerWinner = calculateDistributionAmount(
    //   ownerXrpBalance,
    //   winnerCount
    // );

    // // Debug:
    // return NextResponse.json({
    //   message: "Debug",
    //   debug: dropsToXrp(amountPerWinner),
    // });

    // Debug: OWNER_WALLET
    // return NextResponse.json({
    //   message: "OWNER",
    //   wallet: OWNER_WALLET,
    // });

    // XRP Ledgerクライアントの初期化
    const client = new Client(XRPL_SERVER);
    await client.connect();

    try {
      const response = await client.request({
        command: "account_info",
        account: OWNER_WALLET.address,
        ledger_index: "validated",
      });
      ownerXrpBalance = Number(response.result?.account_data.Balance); // ドロップ単位での残高（文字列）
    } catch (error) {
      client.disconnect();
      //   console.error("Failed to retrieve owner's balance:", error);
      throw new Error("Failed to retrieve owner's balance.");
    } finally {
      if (ownerXrpBalance < 1) {
        throw new Error("Owner's balance is not available.");
      }
    }

    // Debug: OWNER_WALLET
    // return NextResponse.json({
    //   message: "OWNER",
    //   wallet: OWNER_WALLET,
    //   ownerXrpBalance: dropsToXrp(ownerXrpBalance),
    // });

    // トランザクションデータの取得
    const transactions = await fetchTransactions(client, OWNER_WALLET.address);

    // Debug
    // return NextResponse.json({
    //   message: "fetchTransactions",
    //   transactions: transactions,
    // });

    // 10個の6桁のランダムな数値を生成（当選番号）
    const randomNumbers = [];
    for (let i = 0; i < 10; i++) {
      randomNumbers.push(Math.floor(Math.random() * 900000 + 100000));
    }

    // 当選者の存在チェック
    const winningTxs: object[] = await checkWinningTransactions(
      client,
      transactions,
      randomNumbers
    );

    // Debug
    return NextResponse.json({
      message: "checkWinningTransactions",
      transactions: winningTxs,
    });

    // Winner全員にCheckを送信
    const checkCreateResults = await performCheckCreateTransactions(
      client,
      OWNER_WALLET,
      winningTxs
    );

    // Debug
    // return NextResponse.json({
    //   message: "performCheckCreateTransactions",
    //   transactions: checkCreateResults,
    // });

    // エスクロー処理（必要に応じて）
    // if (distributionResult.needsEscrow) {
    //   await sendToEscrow(
    //     client,
    //     ESCROW_ADDRESS,
    //     distributionResult.amountToEscrow
    //   );
    // }

    await client.disconnect();

    return NextResponse.json({
      message: "Distribution completed",
      winners: checkCreateResults,
    });
  } catch (error) {
    console.error("Error in distribution:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}

// 該当期間のトランザクションを取得する
async function fetchTransactions(
  client: Client,
  address: string
): Promise<any> {
  try {
    const unixEpochTimeOfLastSundayUtc = getLastSundayTime(); // UNIXエポック時間（ミリ秒、UTC）を取得

    const res = await client.request({
      command: "account_tx",
      account: OWNER_WALLET.address,
      ledger_index_min: -1,
      ledger_index_max: -1,
      limit: 1000,
    });

    const transactions = res.result.transactions;

    // One week's worth of transactions
    const filteredTxs = transactions.filter((tx) => {
      if (
        tx.tx &&
        tx.tx.date !== undefined &&
        tx.tx.Memos?.[0]?.Memo?.MemoData
      ) {
        const txUnixTimestamp = rippleTimeToUnixTime(tx.tx.date);
        return txUnixTimestamp >= unixEpochTimeOfLastSundayUtc;
      }
      return false;
    });

    return filteredTxs;
  } catch (error) {
    console.error("Failed to fetch txs:", error);
  } finally {
    //
  }
}

// 当選者の確定
async function checkWinningTransactions(
  client: Client,
  transactions: any[],
  randomNumbers: number[]
): Promise<object[]> {
  let allWinningTxs: object[] = [];
  let seenTxHashes = new Set<string>(); // 既に当選と判定されたトランザクションのハッシュを記録

  // 各当選番号に対してチェック
  randomNumbers.forEach((randomNumber) => {
    const winningTxs: object[] = transactions.filter((tx) => {
      if (
        !seenTxHashes.has(tx.tx.hash) &&
        tx.tx &&
        tx.tx.date !== undefined &&
        tx.tx.Memos?.[0]?.Memo?.MemoData
      ) {
        // メモデータを16進数として解釈し、整数に変換
        const memoData = tx.tx.Memos?.[0]?.Memo?.MemoData;
        let resultNum: number | null = null;

        if (memoData) {
          let numberStr = Buffer.from(memoData, "hex").toString("utf8");
          if (numberStr.length === 6) {
            resultNum = Number(numberStr);
          }
        }

        // 当選と判定
        if (randomNumber === resultNum) {
          seenTxHashes.add(tx.tx.hash); // 当選と判定したトランザクションのハッシュを記録
          return true;
        }

        // Debug
        // if (336046 === resultNum) {
        //   seenTxHashes.add(tx.tx.hash); // 当選と判定したトランザクションのハッシュを記録
        //   return true;
        // }
      }
      return false;
    });
    allWinningTxs.push(...winningTxs);
  });

  return allWinningTxs;
}

// 当選者にCheckを送信する
async function performCheckCreateTransactions(
  client: Client,
  wallet: Wallet,
  transactionsData: any[]
): Promise<any[]> {
  const transactionResults: any[] = [];

  // 当選者数
  // const winnerCount = transactionsData.length;
  // const winnerCount: number = transactionsData.length * 100;
  const winnerCount: number = transactionsData.length;

  if (winnerCount <= 0) {
    return [];
  }

  const amountPerWinner = calculateDistributionAmount(
    ownerXrpBalance,
    winnerCount
  );

  const amount: string = String(amountPerWinner);

  for (const data of transactionsData) {
    try {
      const today = new Date();
      const checkCreateTx: Transaction = {
        TransactionType: "CheckCreate",
        Account: wallet.address,
        Destination: data.tx.Account,
        SendMax: amount,
        Expiration: unixTimeToRippleTime(getOneYearAfterTime()),
      };

      const preparedTx = await client.autofill(checkCreateTx);
      const signedTx = wallet.sign(preparedTx);
      const txResult = await client.submitAndWait(signedTx.tx_blob);

      transactionResults.push(txResult);
    } catch (error) {
      console.error("Error performing CheckCreate transaction:", error);
      //   transactionResults.push({ error: error.message });
    }
  }

  return transactionResults;
}

// 分配金の計算
function calculateDistributionAmount(
  ownerBalanceDrops: number,
  winnerCount: number
): number {
  if (winnerCount <= 0) {
    throw new Error("Winner count must be greater than 0");
  }

  // オーナーアドレスの残高の9割を計算
  const ninetyPercentOfBalance = ownerBalanceDrops * 0.9;

  // 当選者一人あたりの分配金額を計算
  return Math.round(ninetyPercentOfBalance / winnerCount);
}
