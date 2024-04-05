<template>
    <div class="container">
        <div class="form-container">
            <div class="form-box signup">
                <h2>회원가입</h2>
                <form @submit.prevent="signup">
                    <div class="input-group">
                        <input type="text" id="signup-username" placeholder="아이디" v-model="signupForm.username">
                    </div>
                    <div class="input-group">
                        <input type="password" id="signup-password" placeholder="비밀번호" v-model="signupForm.password">
                    </div>
                    <!-- 회원가입 성공 또는 오류 메시지를 표시하는 부분 -->
                    <p v-if="message" :class="{ 'success-message': isSuccess, 'error-message': !isSuccess }">{{ message
                        }}</p>
                    <button type="submit" class="form-button">Sign up</button>
                </form>
            </div>

            <div class="form-box login">
                <h2>로그인</h2>
                <form @submit.prevent="login">
                    <div class="input-group">
                        <input type="text" id="login-username" placeholder="아이디" v-model="loginForm.username">
                    </div>
                    <div class="input-group">
                        <input type="password" id="login-password" placeholder="비밀번호" v-model="loginForm.password">
                    </div>
                    <button type="submit" class="form-button">Sign in</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    setup() {
        const signupForm = ref({
            username: '',
            password: '',
        });
        const loginForm = ref({
            username: '',
            password: '',
        });
        const router = useRouter();

        // 메시지와 성공 여부를 전역적으로 관리
        const message = ref('');
        const isSuccess = ref(false);

        const signup = async () => {
            try {
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_API}/signup`, {
                    user_id: signupForm.value.username,
                    password: signupForm.value.password,
                });
                console.log(process.env.VUE_APP_BACKEND_API);
                console.log(`${process.env.VUE_APP_BACKEND_API}`);
                if (response.status === 201) {
                    console.log('회원 가입 성공:', response.data);
                    // 회원가입 성공 메시지를 서버 응답에서 가져옴
                    message.value = response.data.message; // "회원 가입 성공"
                    isSuccess.value = true;
                }
            } catch (error) {
                console.log('회원 가입 실패:', error);
                if (error.response) {
                    // 서버에서 제공하는 오류 메시지를 사용
                    message.value = error.response.data.message; // "이미 가입된 유저입니다." 등
                    isSuccess.value = false;

                    if (error.response.status === 400) {
                        console.log('잘못된 요청입니다.');
                    } else if (error.response.status === 409) {
                        console.log('이미 가입된 유저입니다.');
                    }
                } else {
                    // 서버 응답이 없는 경우의 오류 처리
                    message.value = '회원 가입 처리 중 오류 발생';
                    isSuccess.value = false;
                }
            }
        };
        const login = async () => {
            try {
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_API}/login`, {
                    user_id: loginForm.value.username,
                    password: loginForm.value.password,
                });
                // 상태 코드를 201로 확인
                if (response.status === 201) {
                    console.log('로그인 성공:', response.data);
                    // localStorage에 토큰과 user_id 저장
                    localStorage.setItem('user_id', response.data.user_id); // 서버 수정에 따른 경로 변경

                    message.value = '로그인 성공';
                    isSuccess.value = true;
                    router.push('/selectexam'); // 성공 후 리디렉션
                }
            } catch (error) {
                console.log('로그인 실패:', error);
                if (error.response) {
                    // 서버에서 제공하는 오류 메시지를 사용
                    message.value = error.response.data.message; // 오류 메시지 표시
                    isSuccess.value = false;

                    if (error.response.status === 400) {
                        console.log('잘못된 요청입니다.');
                    } else if (error.response.status === 401) {
                        console.log('인증에 실패했습니다.');
                        console.log(error.response.data)
                    }
                } else {
                    // 서버 응답이 없는 경우의 오류 처리
                    message.value = '로그인 처리 중 오류 발생';
                    isSuccess.value = false;
                }
            }
        };

        return { signupForm, loginForm, signup, login, message, isSuccess };
    }
};
</script>



<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 88vh;
    /* 전체 화면 높이 */
    background: #f5f5f5;
    /* 배경색 */
    font-family: Arial, sans-serif;
    /* 폰트 스타일 */
}


.form-container {
    display: flex;
    gap: 2rem;
}

.form-box {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-box h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
}

.input-group {
    width: 100%;
    margin-bottom: 1rem;
}

.input-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form-button {
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-radius: 5px;
    background: black;
    color: white;
    cursor: pointer;
}

.form-button:hover {
    background: #333;
}

/* 추가 반응형 디자인 */
@media (max-width: 768px) {
    .form-container {
        flex-direction: column;
    }
}

/* 스타일 섹션의 추가 */
.success-message {
    color: green;
}

.error-message {
    color: red;
}
</style>
