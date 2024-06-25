FROM node:18-alpine as BUILD_IMAGE

WORKDIR /app/react-sample-todo-app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

FROM node:18-alpine as PRODUCTION_IMAGE

WORKDIR /app/react-sample-todo-app

COPY --from=BUILD_IMAGE /app/react-sample-todo-app/dist /app/react-sample-todo-app/dist

EXPOSE 5173

COPY package.json .
COPY vite.config.json .

RUN npm install typescript

CMD ["npm", "run", "preview"]