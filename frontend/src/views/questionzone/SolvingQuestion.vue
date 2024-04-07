<template>
    <div v-if="question" class="question-container">
        <div class="question">
            <h2>{{ question.question_text }}</h2>
            <template v-if="isMultipleChoice">
                <div class="form-group" v-for="(option, index) in question.options" :key="'mc-' + index">
                    <input type="checkbox" :id="'option' + index" :value="option" v-model="selectedAnswers"
                        :name="'answer' + index">
                    <label :for="'option' + index">{{ getAnswerLetter(index) }}. {{ option }}</label>
                </div>
            </template>
            <template v-else>
                <div class="form-group" v-for="(option, index) in question.options" :key="'sc-' + index">
                    <input type="radio" :id="'option' + index" :value="option" v-model="selectedAnswer"
                        :name="question._id">
                    <label :for="'option' + index">{{ getAnswerLetter(index) }}. {{ option }}</label>
                </div>
            </template>
        </div>
        <div class="comment-section">
            <textarea v-model="comment" placeholder="코멘트를 입력하세요..."></textarea>
            <button @click="submitAnswer">제출</button>
        </div>
    </div>
    <p v-else>문제를 불러오는 중....</p>
</template>


<script>
import axios from 'axios';

export default {
    name: 'SolvingQuestion',
    data() {
        return {
            question: null,
            selectedAnswer: '',
            selectedAnswers: [],
            comment: ''
        };
    },
    computed: {
        isMultipleChoice() {
            return this.question && this.question.correct_answer && this.question.correct_answer.length > 1;
        }
    },
    methods: {
        async loadQuestionData() {
            const questionId = this.$route.params.questionId;
            try {
                const response = await axios.get(`${process.env.VUE_APP_BACKEND_API}/question-detail`, {
                    params: { _id: questionId }
                });
                if (response.data) {
                    this.question = response.data;
                }
            } catch (error) {
                console.error('Error loading question:', error);
            }
        },
        async submitAnswer() {
            const userId = localStorage.getItem('user_id'); // 로컬 스토리지에서 사용자 ID 가져오기
            const questionId = this.question._id; // 문제 ID 가져오기

            // 다중 답변을 선택한 경우 selectedAnswers 배열을 사용하고,
            // 단일 답변을 선택한 경우 selectedAnswer 값을 배열에 담습니다.
            let answers = this.isMultipleChoice ? this.selectedAnswers : [this.selectedAnswer];

            try {
                // 답변을 대문자로 변환 후 제출
                await axios.post(`${process.env.VUE_APP_BACKEND_API}/answer`, {
                    user_id: userId,
                    question_id: questionId,
                    selected_answer: answers.map(answer => answer.toUpperCase())
                });

                // 댓글이 입력된 경우, 댓글 제출
                if (this.comment.trim() !== '') {
                    await this.submitComment(userId, questionId);
                }

                alert('답변이 제출되었습니다.');
                this.$router.push({ name: 'discussquestion', params: { questionId: questionId } });
            } catch (error) {
                console.error('Error submitting answer:', error);
                // 오류 처리 로직
                if (error.response && error.response.status === 409) {
                    alert('이미 이 문제에 답변을 제출했습니다.');
                } else {
                    alert('답변 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
                }
            }
        }
        ,
        async submitComment(userId, questionId) {
            // 이 함수에서 userId와 questionId 매개변수를 사용하여 API 호출
            try {
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_API}/discussion`, {
                    user_id: userId,
                    question_id: questionId,
                    discussion_content: this.comment
                });

                if (response.status === 200) {
                    // 성공적으로 댓글이 제출됨
                    alert('댓글이 성공적으로 제출되었습니다.');
                    this.comment = ''; // 코멘트 초기화
                    // 댓글 목록 새로고침 등의 추가 작업
                }
            } catch (error) {
                console.error('댓글 제출 중 오류가 발생했습니다:', error);
                if (error.response && error.response.status === 400) {
                    // 서버에서 400 오류 응답이 반환된 경우, 사용자에게 알림
                    alert('오류가 발생했습니다: ' + error.response.data.message);
                }
            }

        }
        ,
        getAnswerLetter(index) {
            return String.fromCharCode(65 + index); // 옵션 인덱스를 A, B, C...로 변환
        }
    },
    mounted() {
        this.loadQuestionData();
    }
};
</script>




<style scoped>
.question-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.question h2 {
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 10px;
}

.form-group input[type="radio"] {
    margin-right: 5px;
}

.form-group label {
    margin-right: 10px;
}

.comment-section textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
}

button {
    padding: 10px 20px;
    border: none;
    background-color: black;
    color: white;
    cursor: pointer;
    border-radius: 4px;
}

button:hover {
    background-color: #333;
}
</style>