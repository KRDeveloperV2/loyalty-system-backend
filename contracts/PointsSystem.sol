// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract PointsSystem {
    struct UserPoint {
        uint256 userId;
        string phone;
        uint256 points;
    }

    enum TransactionType { Add, Redeem, TransferIn, TransferOut }

    struct PointTransaction {
        uint256 userId;
        uint256 points;
        TransactionType transactionType;
        uint256 timestamp;
        uint256 toUserId;
        uint256 balanceAfterTransaction;
        bytes32 txHash;         // เพิ่มฟิลด์ transaction hash
        string method;           // เพิ่มฟิลด์ method
        uint256 blockNumber;     // เพิ่มฟิลด์ block number
    }

    mapping(uint256 => UserPoint) public userPoints;
    mapping(uint256 => PointTransaction[]) public pointTransactions;

    event PointsAdded(uint256 userId, uint256 points);
    event PointsRedeemed(uint256 userId, uint256 points);
    event PointsTransferred(uint256 fromUserId, uint256 toUserId, uint256 points);

    function createUserIfNotExists(uint256 _userId) internal {
        if (userPoints[_userId].userId == 0) {
            userPoints[_userId] = UserPoint(_userId, "", 0); // phone ค่าว่าง
        }
    }

    function addPoint(uint256 _userId, string memory _phone, uint256 _points) public {
        createUserIfNotExists(_userId);

        userPoints[_userId].points += _points;
        userPoints[_userId].phone = _phone;

        uint256 balanceAfter = userPoints[_userId].points;

        pointTransactions[_userId].push(
            PointTransaction(
                _userId,
                _points,
                TransactionType.Add,
                block.timestamp,
                0,
                balanceAfter,
                keccak256(abi.encodePacked(_userId, _points, block.timestamp)),
                "addPoint",
                block.number
            )
        );

        emit PointsAdded(_userId, _points);
    }

    function redeemPoint(uint256 _userId, uint256 _points) public {
        require(userPoints[_userId].userId != 0, "User does not exist");
        require(userPoints[_userId].points >= _points, "Insufficient points to redeem");

        userPoints[_userId].points -= _points;
        uint256 balanceAfter = userPoints[_userId].points;

        pointTransactions[_userId].push(
            PointTransaction(
                _userId,
                _points,
                TransactionType.Redeem,
                block.timestamp,
                0,
                balanceAfter,
                keccak256(abi.encodePacked(_userId, _points, block.timestamp)),
                "redeemPoint",
                block.number
            )
        );

        emit PointsRedeemed(_userId, _points);
    }

    function transferPoint(uint256 _fromUserId, uint256 _toUserId, uint256 _points) public {
        createUserIfNotExists(_toUserId);

        require(userPoints[_fromUserId].userId != 0, "Sender does not exist");
        require(userPoints[_toUserId].userId != 0, "Recipient does not exist");
        require(userPoints[_fromUserId].points >= _points, "Insufficient points");

        userPoints[_fromUserId].points -= _points;
        userPoints[_toUserId].points += _points;

        uint256 senderBalanceAfter = userPoints[_fromUserId].points;
        uint256 recipientBalanceAfter = userPoints[_toUserId].points;

        // บันทึกธุรกรรม TransferOut ของผู้ส่ง
        pointTransactions[_fromUserId].push(
            PointTransaction(
                _fromUserId,
                _points,
                TransactionType.TransferOut
                block.timestamp,
                _toUserId,
                senderBalanceAfter,
                keccak256(abi.encodePacked(_fromUserId, _toUserId, _points, block.timestamp)),
                "transferPoint",
                block.number
            )
        );

        // บันทึกธุรกรรม TransferIn ของผู้รับ
        pointTransactions[_toUserId].push(
            PointTransaction(
                _toUserId,
                _points,
                TransactionType.TransferIn,
                block.timestamp,
                _fromUserId,
                recipientBalanceAfter,
                keccak256(abi.encodePacked(_toUserId, _fromUserId, _points, block.timestamp)),
                "transferPoint",
                block.number
            )
        );

        emit PointsTransferred(_fromUserId, _toUserId, _points);
    }

    function getPoint(uint256 _userId) public view returns (uint256) {
        return userPoints[_userId].points;
    }

    function getTransaction(uint256 _userId) public view returns (PointTransaction[] memory) {
        return pointTransactions[_userId];
    }
}
