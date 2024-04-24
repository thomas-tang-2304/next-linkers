const { readFile, readFileSync, readdirSync } = require("fs");

const measureTime = (cb) => {
  // Bắt đầu đo thời gian
  const startTime = new Date();
  cb();

  // Kết thúc đo thời gian
  const endTime = new Date();

  const elapsedTime = endTime - startTime;

  return elapsedTime;
};

module.exports = { measureTime };
