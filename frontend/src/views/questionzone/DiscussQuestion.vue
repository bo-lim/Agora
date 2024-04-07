<template>
    <div v-if="question" class="discussion-container">
        <!-- 질문 섹션 -->
        <div class="question-section">
            <h2>{{ question.question_text }}</h2>
            <ul>
                <li v-for="(option, index) in question.options" :key="index">
                    {{ getAnswerLetter(index) }}. {{ option }}
                </li>
            </ul>
        </div>
        <!-- 통계 섹션 -->
        <div class="statistics-section">
            <div v-for="(option, index) in question.options" :key="index" class="statistic">
                {{ getAnswerLetter(index) }} : {{ percentages[option] }}%
            </div>
        </div>
        <!-- 정답 표시 섹션 -->
        <div class="correct-answer-section">
            <div class="correct-answer">정답: {{ question.correct_answer }}</div>
        </div>
        <!-- 댓글 섹션 -->
        <div class="comments-section">
            <h2>토론</h2>
            <div v-if="comments.length === 0" class="no-comments">댓글이 없습니다.</div>
            <div v-else>
                <ul>
                    <li v-for="comment in comments" :key="comment.id">
                        <div class="comment">
                            <p>ID: {{ comment.user_id }}</p>
                            <p>{{ comment.discussion_content }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 댓글 제출 섹션 -->
            <div class="comment-submit-section">
                <textarea v-model="newComment" placeholder="코멘트를 입력하세요..."></textarea>
                <button @click="submitComment">댓글 제출</button>
            </div>
        </div>
        <!-- 뒤로 가기 버튼 -->
        <button @click="goToListPage">목록으로 돌아가기</button>
    </div>
    <p v-else>질문을 불러오는 중...</p>
</template>



<script>
import axios from 'axios';

export default {
    name: 'DiscussQuestion',
    data() {
        return {
            question: null,
            comments: [],
            percentages: [], // API로부터 가져온 정답 비율을 저장하기 위한 배열
            newComment: '',  // 새 댓글 입력을 위한 데이터 바인딩
            qualification_type: '', // 이전 페이지로부터 받아올 자격 유형
        };
    },

    computed: {
        commentsWithLetters() {
            return this.comments.map((comment, index) => {
                return {
                    letter: this.getAnswerLetter(index),
                    comment: comment
                };
            });
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
                    const data = response.data;
                    // 옵션 내용을 기반으로 정답의 인덱스를 찾고, 해당 인덱스를 알파벳으로 변환합니다.
                    const correctAnswersLetters = data.correct_answer.map(answer =>
                        this.getAnswerLetter(data.options.indexOf(answer))
                    ).join(', ');



                    this.question = {
                        id: data._id,
                        question_text: data.question_text,
                        options: data.options,
                        correct_answer: correctAnswersLetters, // 변환된 알파벳 문자열을 저장
                    };
                    // API 응답에서 qualification_type을 설정합니다.
                    this.qualification_type = data.qualification_type || 'default';
                    await this.fetchPercentages(questionId);
                }
            } catch (error) {
                console.error('Error loading question:', error);
            }
        },
        async loadComments() {
            const questionId = this.$route.params.questionId;
            try {
                const response = await axios.get(`${process.env.VUE_APP_BACKEND_API}/discussion`, {
                    params: { question_id: questionId }
                }

                );
                // 서버로부터 받은 JSON 데이터를 comments 배열에 저장
                this.comments = response.data.map(comment => ({
                    id: comment._id, // 댓글 고유 ID (서버 응답에 따라 조정 필요)
                    user_id: comment.user_id,
                    discussion_content: comment.discussion_content,
                }));
            } catch (error) {
                console.error('Error loading comments:', error);
                alert('댓글을 불러오는데 실패했습니다.');
                this.comments = []; // 오류 발생 시 comments 배열 초기화
            }
        }
        ,
        async submitComment() {
            const userId = localStorage.getItem('user_id'); // 로컬 스토리지에서 user_id 가져오기
            const questionId = this.question.id;
            if (!this.newComment.trim()) {
                alert('댓글 내용을 입력해주세요.');
                return;
            }

            try {
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_API}/discussion`, {
                    user_id: userId,
                    question_id: questionId,
                    discussion_content: this.newComment,
                });
                // 성공적인 응답 처리, 서버로부터 JSON 응답을 기대함
                if (response.status === 200 || response.status === 201) {
                    alert('댓글이 성공적으로 추가되었습니다.');
                    this.newComment = ''; // 댓글 입력란 초기화
                    this.loadComments(); // 댓글 목록 새로고침
                }
            } catch (error) {
                console.error('댓글 제출 중 오류가 발생했습니다:', error);
                alert('댓글을 추가하는데 실패했습니다.');
            }
        }
        ,
        async fetchPercentages(questionId) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_BACKEND_API}/ratio`, {
                    params: { question_id: questionId }
                });

                if (response.status === 200 && response.data) {
                    // 백엔드로부터 받은 비율 데이터를 올바르게 처리하여 percentages에 저장
                    let updatedPercentages = this.question.options.reduce((acc, option) => {
                        acc[option] = response.data[option] || '0.00'; // 텍스트를 기준으로 비율 할당
                        return acc;
                    }, {});

                    // percentages 객체 업데이트
                    this.percentages = updatedPercentages;
                } else {
                    throw new Error('Failed to fetch percentages');
                }
            } catch (error) {
                console.error('Error fetching percentages:', error);
                // 에러 발생 시 percentages 데이터 초기화
                this.percentages = {};
            }
        },

        getAnswerLetter(index) {
            // 옵션 인덱스를 알파벳으로 변환하여 반환
            return String.fromCharCode(65 + index);
        }
        ,
        goToListPage() {
            this.$router.push({
                name: 'questionzone',
                query: { category: this.qualification_type }
            });
        }
    },

    created() {
        this.qualification_type = this.$route.query.qualification_type || 'default';
        // 문제 데이터와 댓글 데이터를 순차적으로 로드합니다.
        this.loadQuestionData().then(() => {
            this.loadComments(); // 문제 데이터 로드가 완료된 후 댓글 데이터 로드
        });
    }
    ,
};
</script>


<style scoped>
.discussion-container {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.question-section input,
.comments-section textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.statistics-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.selected-answer {
    font-weight: bold;
    margin-bottom: 5px;
}

.correct-answer-section {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.stats span,
.correct-answer span {
    display: block;
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 4px;
}

.comment {
    background-color: #fff;
    border-left: 5px solid #555;
    /* 또는 해당 댓글의 정답 여부에 따라 색상 변경 */
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
}


.comment textarea {
    width: calc(100% - 20px);
    /* padding을 고려한 너비 설정 */
    margin-top: 10px;
}

.comment button {
    position: absolute;
    right: 10px;
    bottom: 10px;
}

button {
    padding: 5px 10px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #555;
}

.image-section img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin-bottom: 20px;
}

.comment-submit-section {
    margin-top: 20px;
}

/* ... 나머지 스타일 ... */
</style>