import { Client } from "xrpl";

export const fetchOwnerBalance = async () => {
  const client = new Client(process.env.NEXT_PUBLIC_XRPL_SERVER || "");
  try {
    await client.connect();
    const response = await client.request({
      command: "account_info",
      account: process.env.NEXT_PUBLIC_OWNER_WALLET_ADDRESS,
      ledger_index: "validated",
    });

    const accountInfo = response.result as any;

    return accountInfo?.account_data.Balance || "0";
  } catch (error) {
    console.error("Error fetching balance:", error);
  } finally {
    client.disconnect();
  }
};
