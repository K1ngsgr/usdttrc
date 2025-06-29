
async function connectWallet() {
  if (window.tronWeb && tronWeb.defaultAddress.base58) {
    document.getElementById("walletAddress").value = tronWeb.defaultAddress.base58;
    getTransactions(tronWeb.defaultAddress.base58);
  } else {
    alert("Please open in TrustWallet or TronLink DApp Browser.");
  }
}

async function getTransactions(address) {
  const url = `https://apilist.tronscan.org/api/token_trc20/transfers?limit=10&start=0&sort=-timestamp&count=true&filterTokenValue=USDT&toAddress=${address}`;
  try {
    const res = await axios.get(url);
    const txs = res.data.data;
    const table = document.getElementById("txTableBody");
    table.innerHTML = "";
    txs.forEach(tx => {
      const row = document.createElement("tr");
      const type = tx.to_address === address ? "Receive" : "Send";
      const value = tx.to_address === address ? "+" : "-";
      row.innerHTML = `<td>${type}</td><td>${value} ${tx.tokenInfo.symbol}</td><td>${new Date(tx.block_timestamp).toLocaleString()}</td>`;
      table.appendChild(row);
    });
  } catch (e) {
    alert("Error fetching transactions.");
  }
}
