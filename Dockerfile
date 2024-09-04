FROM node:18.18.2
WORKDIR /app
COPY . .
RUN yarn
EXPOSE 3000
CMD ["yarn","dev"]