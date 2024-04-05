<template>
    <div class="body">
        <div>
            <list-question></list-question>
        </div>
    </div>
</template>

<script>
import ListQuestion from './ListQuestion.vue'
export default {
    components: { ListQuestion  },

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