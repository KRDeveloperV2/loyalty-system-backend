const { web3, contract } = require('../services/web3Service');

// ฟังก์ชันสำหรับเพิ่ม Points บน Blockchain
const addPointToBlockchain = async (userId, phone, points) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const fromAddress = accounts[0];

        if (typeof fromAddress !== 'string') {
            throw new Error("Invalid fromAddress: Expected a string but got " + typeof fromAddress);
        }

        if (typeof contract.methods.addPoint !== 'function') {
            throw new Error("Smart Contract does not have a method named 'addPoint'");
        }

        console.log("Calling addPoint with:", userId, phone, points);

        const receipt = await contract.methods.addPoint(userId, phone, points).send({
            from: fromAddress,
            gas: 3000000,
            gasPrice: web3.utils.toWei('80', 'gwei')
        });

        console.log("Transaction successful:", receipt);

        return receipt;
    } catch (error) {
        console.error('Error adding point to blockchain:', error.message);
        throw new Error('Failed to add points to blockchain: ' + error.message);
    }
};

// ฟังก์ชันสำหรับใช้คะแนน (Redeem Points) บน Blockchain
const redeemPointOnBlockchain = async (userId, points) => {
    if (userId === undefined || points === undefined) {
      throw new Error('Invalid input: userId or points is undefined');
    }

    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];

    if (typeof contract.methods.redeemPoint !== 'function') {
        throw new Error("Smart Contract does not have a method named 'redeemPoint'");
    }

    console.log("Calling redeemPoint with:", userId, points);

    try {
      const receipt = await contract.methods.redeemPoint(userId, points).send({
        from: fromAddress,
        gas: 3000000,
        gasPrice: web3.utils.toWei('80', 'gwei')
      });

      console.log("Transaction successful:", receipt);
      return receipt;
    } catch (error) {
      console.error("Error redeeming point on blockchain:", error.message);
      throw new Error("Failed to redeem points on blockchain: " + error.message);
    }
};

// ฟังก์ชันสำหรับโอน Points ให้กับเพื่อนบน Blockchain
const transferPointOnBlockchain = async (fromUserId, toUserId, points) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const fromAddress = accounts[0];

        if (typeof contract.methods.transferPoint !== 'function') {
            throw new Error("Smart Contract does not have a method named 'transferPoint'");
        }

        console.log("Calling transferPoint with:", fromUserId, toUserId, points);

        const receipt = await contract.methods.transferPoint(fromUserId, toUserId, points).send({
            from: fromAddress,
            gas: 1000000,
            gasPrice: web3.utils.toWei('30', 'gwei'),
        });

        console.log("Transaction successful:", receipt);

        return receipt;
    } catch (error) {
        console.error('Error transferring points on blockchain:', error.message);
        throw new Error('Failed to transfer points on blockchain: ' + error.message);
    }
};

// ฟังก์ชันสำหรับดึงคะแนนของผู้ใช้จาก Blockchain
const getUserPoints = async (userId) => {
    try {
        if (typeof contract.methods.getPoint !== 'function') {
            throw new Error("Smart Contract does not have a method named 'getPoint'");
        }

        console.log("Getting points for user:", userId);

        const points = await contract.methods.getPoint(userId).call();
        const pointsNumber = web3.utils.toBN(points).toNumber();

        console.log("User Points:", pointsNumber);

        return {
            userId: userId,
            points: pointsNumber
        };
    } catch (error) {
        console.error('Error fetching user points from blockchain:', error.message);
        throw new Error('Failed to fetch user points from blockchain: ' + error.message);
    }
};

// ฟังก์ชันสำหรับดึงประวัติการทำธุรกรรมของผู้ใช้จาก Blockchain
const getPointTransactionsByUserId = async (userId) => {
    try {
        if (typeof contract.methods.getTransaction !== 'function') {
            throw new Error("Smart Contract does not have a method named 'getTransaction'");
        }

        console.log("Getting transaction history for user:", userId);

        const transactions = await contract.methods.getTransaction(userId).call();

        const formattedTransactions = transactions.map((tx, index) => {
            const transactionTypesText = ['AddPoint', 'Redeem', 'TransferIn', 'TransferOut'];
            const transactionTypeText = transactionTypesText[tx.transactionType];

            console.log(tx);

            return {
                userId: tx.userId,
                points: tx.points,
                transactionType: transactionTypeText,
                timestamp: new Date(tx.timestamp * 1000),
                toUserId: tx.toUserId,
                balanceAfterTransaction: tx.balanceAfterTransaction,
                txHash : tx.txHash,
                method : tx.method,
                blockNumber : tx.blockNumber
            };
        });

        return formattedTransactions;
    } catch (error) {
        console.error('Error fetching user transactions from blockchain:', error.message);
        throw new Error('Failed to fetch user transactions from blockchain: ' + error.message);
    }
};

module.exports = { 
    addPointToBlockchain, 
    redeemPointOnBlockchain,
    transferPointOnBlockchain,
    getUserPoints, 
    getPointTransactionsByUserId 
};
