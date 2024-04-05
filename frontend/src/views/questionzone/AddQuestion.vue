<template>
    <div class="add-question-container">
        <h2>문제 추가</h2>
        <div class="form-group">
            <label for="question">Question</label>
            <input type="text" id="question" v-model="newQuestion.text" />
        </div>

        <div class="form-group">
            <label for="isMultipleAnswer">다중 답변 설정</label>
            <input type="checkbox" id="isMultipleAnswer" v-model="newQuestion.isMultipleAnswer" />
        </div>

        <div class="form-group" v-for="(answer, index) in newQuestion.answers" :key="index">
            <label :for="'answer-' + index">Answer {{ String.fromCharCode(65 + index) }}</label>
            <input :id="'answer-' + index" type="text" v-model="answer.text" />
            <button v-if="newQuestion.answers.length > 1" @click="removeAnswerOption(index)">- 선택지 삭제</button>
            <button v-if="index === newQuestion.answers.length - 1" @click="addAnswerOption">+ 선택지 추가</button>
        </div>

        <div class="form-group">
            <label>Correct Answer(s)</label>
            <div v-for="(answer, index) in newQuestion.answers" :key="index">
                <input :type="newQuestion.isMultipleAnswer ? 'checkbox' : 'radio'" :id="'correct-' + index"
                    v-model="answer.selected" :value="true"
                    :name="newQuestion.isMultipleAnswer ? '' : 'correct-answer'">
                <label :for="'correct-' + index">{{ String.fromCharCode(65 + index) }}. {{ answer.text }}</label>
            </div>
        </div>

        <button @click="submitQuestion">추가</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AddQuestion',
    data() {
        return {
            newQuestion: {
                text: '',
                answers: [{ text: '', selected: false }],
                isMultipleAnswer: false
            },
            qualification_type: this.$route.query.category || ''
        };
    },
    methods: {
        addAnswerOption() {
            this.newQuestion.answers.push({ text: '', selected: false });
        },
        removeAnswerOption(index) {
            if (this.newQuestion.answers.length > 1) {
                this.newQuestion.answers.splice(index, 1);
            }
        },
        async submitQuestion() {
            const userId = localStorage.getItem('user_id');
            const correctAnswers = this.newQuestion.answers
                .filter(answer => answer.selected)
                .map(answer => answer.text);

            const questionData = {
                question_text: this.newQuestion.text,
                options: this.newQuestion.answers.map(answer => answer.text),
                correct_answer: correctAnswers,
                user_id: userId,
                qualification_type: this.qualification_type 
            };

            try {
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_API}/question`, questionData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 201) {
                    alert('문제 생성에 성공했습니다.');
                    console.log(response)
                    this.$router.push({ name: 'questionzone', query: { category: this.qualification_type } });
                }
            } catch (error) {
                console.error('Error submitting question:', error);
                alert('문제 추가 중 오류가 발생했습니다.');
            }
        }
    }
};
</script>


<style scoped>
.add-question-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

#question {
    padding: 20px 10px;
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
