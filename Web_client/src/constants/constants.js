const SERVER_CONSTANTS = {
  localhost: "192.168.1.8",
  port: "3000",
};
const RESPONSE_STATUS = {
  SUCCESS: 200 || 201,
  FAILED: 400 || 404 || 500,
};
const STATUS_CONSTANTS = {
  SUCCESS: "Completed",
  COMPLETED: "Completed",
  FAILED: "Failed",
  PROGRESS: "On-progress",
  ERROR: "Error",
};
export default {
  SERVER_CONSTANTS,
  RESPONSE_STATUS,
  STATUS_CONSTANTS,
};
