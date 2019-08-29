FROM node
WORKDIR /Servidor
COPY package.json .
COPY ServidorCanalDirecto.js .
COPY ConexionDB_CanalDirecto.js .
COPY ModelosDatos ModelosDatos
RUN npm install
EXPOSE 80
CMD ["node","ServidorCanalDirecto.js"]
