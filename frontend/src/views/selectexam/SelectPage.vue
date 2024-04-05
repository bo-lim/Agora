<template>
    <div class="body">
        <div>
            <select-exam></select-exam>
        </div>
    </div>
</template>

<script>
import SelectExam from './SelectExam.vue'
export default {
    components: { SelectExam  },

}
</script>

<style>
.body {
    margin: 0;
    padding: 0;
    background-color: #E5E5E5;
    /* 배경 색 설정 */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>