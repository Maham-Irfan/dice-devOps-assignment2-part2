FROM node
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN chmod +x migrate-and-start.sh
RUN npm install
EXPOSE 3000
RUN npm run build
ENTRYPOINT ["./migrate-and-start.sh"]
