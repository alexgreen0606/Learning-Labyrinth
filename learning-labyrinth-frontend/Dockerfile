FROM node:20

WORKDIR /app

COPY package*.json ./

# must force the install due to deprecated react-typed package
RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["npm", "start"]