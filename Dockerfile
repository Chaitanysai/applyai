FROM mcr.microsoft.com/playwright:v1.41.1-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p storage/resumes
RUN touch storage/credentials.json

EXPOSE 10000

CMD ["node", "server.js"]
