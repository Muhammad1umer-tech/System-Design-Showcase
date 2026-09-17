FROM node:20.12.0
WORKDIR /adminfrontend
COPY . .
RUN yarn install
EXPOSE 3000
CMD ["yarn", "start", "--host"]