FROM node:20-alpine AS frontend

WORKDIR /app/Goraebab-Frontend

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


FROM node:20-alpine

WORKDIR /app/Goraebab-Frontend

COPY --from=frontend /app/Goraebab-Frontend/.next ./.next
COPY --from=frontend /app/Goraebab-Frontend/public ./public
COPY --from=frontend /app/Goraebab-Frontend/.env ./.env

EXPOSE 3000

CMD ["npm", "start"]


