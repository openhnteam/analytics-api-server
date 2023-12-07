FROM node:18-buster
USER root
ENV TZ=Asia/Shanghai
RUN mkdir -p /home/app/
COPY ./ /home/app/analytics-api/
RUN ls -la /home/app/analytics-api/*
WORKDIR /home/app/analytics-api/
EXPOSE 8081
RUN npm install
RUN npm run build
CMD ["node", "dist/main"]