<template>
    <header>
        <div class="headline">
            <!-- 이미지와 텍스트에 tabindex와 클래스 추가 -->
            <img src="../../assets/image.png" class="clickable" style="max-width: 8%; height: auto;" @click="goToHomePage" tabindex="0">
            <div class="headline-menu clickable" @click="goToHomePage" tabindex="0">
                <p>AGORA</p>
            </div>
        </div>
    </header>
    <nav></nav>
</template>

<script>
export default {
    data() {
        return {
            boxPadding: '20px'
        }
    },
    methods: {
        goToHomePage() {
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
header {
    top: 8px;
    height: 15%;
    border-bottom: 1px solid #E6E6E6;
    background-color: #FFFFFF;
}

.headline {
    display: flex;
    height: 100%;
    align-items: center;
}

.headline-menu {
    display: flex;
    height: 100%;
    cursor: pointer; /* 마우스 커서를 포인터로 변경 */
}

.clickable {
    cursor: pointer; /* 마우스 커서를 포인터로 변경 */
    transition: transform 0.2s; /* 부드러운 변환 효과 */
}

/* 호버 시에 시각적 효과 */
.clickable:hover {
    transform: scale(1.05); /* 이미지와 텍스트를 약간 확대 */
}

.clickable:focus {
    outline: none; /* 기본 윤곽선 제거 */
    border: 2px solid #ccc; /* 포커스 시 윤곽선 추가 */
}
</style>
