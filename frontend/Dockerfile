FROM node:lts-alpine

# 환경 변수를 빌드 인자로 선언
ARG VUE_APP_BACKEND_API

# 빌드 인자를 환경 변수로 설정
ENV VUE_APP_BACKEND_API=$VUE_APP_BACKEND_API

# simple http server for serving static content을 설치
RUN npm install -g http-server

# 'app' 폴더를 현재 작업 디렉토리로 설정
WORKDIR /app

# 'package.json'과 'package-lock.json' (있는 경우)을 복사
COPY package*.json ./

# 프로젝트 의존성 설치, 개발 의존성 제외
RUN npm install --production

# 프로젝트 파일과 폴더를 현재 작업 디렉토리로 복사
COPY . .

# 프로덕션을 위한 앱 빌드
RUN npm run build

EXPOSE 8080
CMD ["http-server", "dist"]
