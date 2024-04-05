# Node.js 공식 이미지를 사용합니다. LTS 버전을 기반으로 합니다.
FROM node:lts-alpine

# simple http server for serving static content를 설치합니다.
RUN npm install -g http-server

# 'app' 폴더를 작업 디렉토리로 설정합니다.
WORKDIR /app

# package.json과 package-lock.json 파일을 복사합니다.
COPY package*.json ./

# 환경변수를 위한 ARG 설정을 추가합니다.
ARG VUE_APP_BACKEND_API

# 프로젝트 의존성을 설치합니다. 개발 의존성은 제외합니다.
RUN npm install --production

# 나머지 프로젝트 파일을 작업 디렉토리로 복사합니다.
COPY . .

# .env 파일을 생성하여 빌드 시 환경변수를 주입합니다.
RUN echo "VUE_APP_BACKEND_API=${VUE_APP_BACKEND_API}" > .env

# 애플리케이션을 프로덕션 환경으로 빌드합니다.
RUN npm run build

# 애플리케이션을 제공할 포트를 노출합니다.
EXPOSE 8080

# http-server를 사용하여 'dist' 디렉토리 내의 파일을 서비스합니다.
CMD [ "http-server", "dist" ]