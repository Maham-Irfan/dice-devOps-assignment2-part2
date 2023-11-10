FROM node
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
ENV store="Stationary Shop"
EXPOSE 3000
RUN npm run build
ENTRYPOINT ["npm", "run", "dev"]