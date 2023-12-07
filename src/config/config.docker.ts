export default {
  mode: "docker",
  mysql: {
    type: 'mysql',
    host: 'mysql',
    port: 3306,
    driver: 'mysql2',
    username: 'root',
    password: 'hello.openhn666',
    timezone: '+08:00',
    database: 'analytics',
    charset: 'UTF8_GENERAL_CI'
    // synchronize: true
  },
  redis: {
    host: 'redis',
    port: 6379,
    password: 'hello.openhn666',
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
    brokers: ["kafka:9092"],
  },
  swagger: {
    // 是否启用swagger
    enable: true,
    serverHost: 'http://localhost/app/'
  },
  ngIpKeys:['X-Real-IP', 'X-Forwarded-For']
};
