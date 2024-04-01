# Use base node 8 image from Docker hub
FROM node:8

WORKDIR /backend

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

EXPOSE 8000
# Copy rest of the application csource code
COPY . .

# Run app.js with debugging port when container launches
#ENTRYPOINT ["node", "--inspect=9229", "app.js"]
CMD [ "npm","run","dev" ]
# Comment above and uncomment below to run app.js without debugger port when container launches
# ENTRYPOINT ["node", "app.js"]
