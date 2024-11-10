const PointsSystem = artifacts.require("PointsSystem");

module.exports = function (deployer) {
  deployer.deploy(PointsSystem);
};
