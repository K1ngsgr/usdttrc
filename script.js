
function waitForTronWeb(callback) {
  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    callback(window.tronWeb.defaultAddress.base58);
  } else {
    setTimeout(() => waitForTronWeb(callback), 500);
  }
}

function connectWallet() {
  waitForTronWeb((address) => {
    document.getElementById("walletAddress").value = address;
    getTransactions(address);
  });
}

async function getTransactions(address) {
  const url = `https://apilist.tronscan.org/api/token_trc20/transfers?limit=10&start=0&sort=-timestamp&count=true&filterTokenValue=USDT&toAddress=${address}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const txs = data.data;
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
