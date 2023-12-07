export default {
  mode: "prod",
  mysql: {
    type: 'mysql',
    host: '',
    port: 3306,
    driver: 'mysql2',
    username: '',
    password: '',
    timezone: '+08:00',
    database: '',
    charset: 'UTF8_GENERAL_CI'
    // synchronize: true
  },
  redis: {
    host: '',
    port: 6379,
    password: '',
    db: 0,
    keyPrefix: 'aly_'
  },

  log: {
    //日志级别 info / debug / error
    level: "info",
    filepath: "logs/analytics.log",
  },
  kafka: {
    clientId: "analytics-clientId",
    brokers: [""],
  },
  ngIpKeys:['X-Real-IP', 'X-Forwarded-For']
};
